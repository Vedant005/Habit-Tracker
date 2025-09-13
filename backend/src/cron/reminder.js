import cron from "node-cron";
import nodemailer from "nodemailer";
import Habit from "../models/Habit.js";
import CheckIn from "../models/CheckIn.js";
import User from "../models/User.js";
import { startOfDay, endOfDay, startOfISOWeek, endOfISOWeek } from "date-fns";

const transporter = nodemailer.createTransport({
  service: "gmail", // or use SMTP config
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReminder = async (user, habit) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Reminder: Don't forget your habit - ${habit.name}`,
    text: `Hi ${user.name},\n\nYou haven’t checked in for your habit "${habit.name}". Stay consistent! 💪\n\n- Habit Tracker`,
  };

  await transporter.sendMail(mailOptions);
};

// Run daily at 08:00
cron.schedule("0 8 * * *", async () => {
  console.log("🔔 Running daily reminder job...");

  try {
    const habits = await Habit.find().populate("user");
    const today = new Date();

    for (const habit of habits) {
      let windowStart, windowEnd;

      if (habit.frequency === "daily") {
        windowStart = startOfDay(today);
        windowEnd = endOfDay(today);
      } else {
        windowStart = startOfISOWeek(today);
        windowEnd = endOfISOWeek(today);
      }

      const existingCheckIn = await CheckIn.findOne({
        habit: habit._id,
        user: habit.user._id,
        timestamp: { $gte: windowStart, $lte: windowEnd },
      });

      if (!existingCheckIn) {
        // (Optional) check if lastReminderSent < today to avoid spamming
        await sendReminder(habit.user, habit);
        console.log(`📧 Reminder sent to ${habit.user.email} for habit ${habit.name}`);
      }
    }
  } catch (err) {
    console.error("Reminder job failed:", err.message);
  }
});
