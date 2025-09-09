import mongoose, { Schema } from "mongoose";

const habitSchema = new Schema(
    {
user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
name: { type: String, required: true },
description: {
    type:String
},
category: {
    type:String
},
frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
}, { timestamps: true }
)


export const Habit = mongoose.model("Habit", habitSchema)