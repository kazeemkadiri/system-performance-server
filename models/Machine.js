import mongoose from "mongoose";

const MachineSchema = new mongoose.Schema({
  macAddr: String,
  osType: {
    type: String,
    required: true,
  },
  upTime: {
    type: Number,
    required: true,
  },
  freeMem: {
    type: Number,
    required: true,
  },
  totalMem: {
    type: Number,
    required: true,
  },
  usedMem: {
    type: Number,
    required: true,
  },
  memUsage: {
    type: Number,
    required: true,
  },
  cpuModel: {
    type: String,
    required: true,
  },
  cpuSpeed: {
    type: Number,
    required: true,
  },
  numCores: {
    type: Number,
    required: true,
  },
  cpuLoad: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const MachineModel = mongoose.model("Machine", MachineSchema);

export default MachineModel;
