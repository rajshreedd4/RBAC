const mongoose = require("mongoose");

const { Schema } = mongoose;

const PermissionSchema = new Schema(
  {
    actionName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      default: "",
    },

    method: {
      type: String,
      required: true,
      enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },

    baseUrl: {
      type: String,
      required: true,
    },

    path: {
      type: String,
      required: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("permission", PermissionSchema);