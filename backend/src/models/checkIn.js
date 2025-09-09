import mongoose, { Schema } from "mongoose";

const checkInSchema = new Schema({
user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
habit: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
timestamp: { type: Date, default: () => new Date() }
})

export const CheckIn = mongoose.model("CheckIn", checkInSchema)