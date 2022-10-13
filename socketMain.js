// All server side socket.io operations are managed here
import mongoose from "mongoose";
import MachineModel from "./models/Machine.js";
// Setup mongodb and mongoose connections
mongoose.connect(
  "mongodb://127.0.0.1:27017/perfdata",
  { useNewUrlParser: true },
  () => {
    console.log("Mongodb connected");
  }
);

function socketMain(io, socket) {
  let macAddr;

  socket.on("clientAuth", async (key) => {
    if (key === process.env.NODE_CLIENT_KEY) {
      console.log("Joined node client");
      socket.join("clients");
    } else if (key === process.env.REACT_CLIENT_KEY) {
      console.log("joined react");
      // The socket instance here is from a browser
      socket.join("ui");

      // All the machines that have their stats stored in mongodb database
      // are retrieved and their "isActive" state set to false because it
      // is assumed they are "offline"
      const machines = await MachineModel.find({}).exec();

      machines.forEach((aMachine) => {
        aMachine.isActive = false;
        // "io" is used here because the connecting client must also receive
        // the data being broadcasted to the "ui" room.
        io.to("ui").emit("data", aMachine);
      });
    } else {
      socket.disconnect(true);
    }
  });

  socket.on("disconnect", async () => {
    const machine = await MachineModel.findOne({ macAddr }).exec();

    machine.isActive = false;

    io.to("ui").emit("client-disconnect", machine);
  });

  async function checkAndAdd(data) {
    return await MachineModel.findOneAndUpdate(
      { macAddr: data.macAddr },
      data,
      {
        upsert: true,
      }
    ).exec();
  }

  socket.on("initPerfData", async (data) => {
    macAddr = data.macAddr;

    await checkAndAdd(data);
  });

  socket.on("perfData", (performanceData) => {
    io.to("ui").emit("updatePerfData", performanceData);
  });
}

export default socketMain;
