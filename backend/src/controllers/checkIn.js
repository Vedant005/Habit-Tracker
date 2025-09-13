import CheckIn from "./../models/checkIn.js"
import Habit from "./../models/habit.js";
import { startOfDay, endOfDay, startOfISOWeek, endOfISOWeek } from "date-fns";

// POST /:habitId → Create a check-in
export const createCheckIn = async (req, res) => {
  const { habitId } = req.params;

  try {
    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // --- Daily habit ---
    if (habit.frequency === "daily") {
      const existing = await CheckIn.findOne({
        habit: habitId,
        user: req.user._id,
        timestamp: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) },
      });

      if (existing) {
        return res
          .status(409)
          .json({ message: "Already checked in today for this habit" });
      }
    }

    // --- Weekly habit ---
    if (habit.frequency === "weekly") {
      const existing = await CheckIn.findOne({
        habit: habitId,
        user: req.user._id,
        timestamp: {
          $gte: startOfISOWeek(new Date()),
          $lte: endOfISOWeek(new Date()),
        },
      });

      if (existing) {
        return res
          .status(409)
          .json({ message: "Already checked in this week for this habit" });
      }
    }

    // Create new check-in
    const checkIn = await CheckIn.create({
      user: req.user._id,
      habit: habitId,
    });

    res.status(201).json({
      message: "Check-in created successfully",
      checkIn,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /habit/:habitId → Get all check-ins for a habit
export const getCheckIns = async (req, res) => {
  const { habitId } = req.params;

  try {
    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const checkIns = await CheckIn.find({ habit: habitId, user: req.user._id })
      .sort({ timestamp: 1 }) // oldest → newest
      .lean();

    res.status(200).json({
      habitId,
      total: checkIns.length,
      checkIns,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
