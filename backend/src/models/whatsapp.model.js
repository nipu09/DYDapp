import mongoose, { Schema } from "mongoose";

const whatsappSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    provider: {
      type: String,
      enum: ["meta_cloud_api", "twilio"],
      default: "meta_cloud_api",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isEnabled: {
      type: Boolean,
      default: false,
    },

    preferences: {
      dailyReminder: {
        type: Boolean,
        default: true,
      },

      completionUpdates: {
        type: Boolean,
        default: true,
      },

      weeklySummary: {
        type: Boolean,
        default: true,
      },
    },

    connectedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

whatsappSchema.index({ phoneNumber: 1 });

export const WhatsApp = mongoose.model("WhatsApp", whatsappSchema);
