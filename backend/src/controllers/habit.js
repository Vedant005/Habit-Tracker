import Habit from "./../models/habit.js";

const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }); // only user’s habits
    res.status(200).json({ habits });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createHabits = async (req, res) => {
  const { name, description, category, frequency } = req.body;

  if (
    !name?.trim() ||
    !description?.trim() ||
    !category?.trim() ||
    !frequency?.trim()
  ) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const create = await Habit.create({
      user: req.user._id,
      name,
      description,
      category,
      frequency,
    });

    res.status(201).json({
      message: "Habit created",
      habit: create,
    });
  } catch (error) {
    res.status(500).json({ message: "Habit not created", error: error.message });
  }
};

const editHabits = async (req, res) => {
  const { data, habitId } = req.body;

  try {
    const habitExists = await Habit.findOne({ _id: habitId, user: req.user._id });
    if (!habitExists) {
      return res.status(404).json({ message: "Habit does not exist" });
    }

    const updatedHabit = await Habit.findByIdAndUpdate(
      habitId,
      { $set: data },
      { new: true } // return updated document
    );

    if (!updatedHabit) {
      return res.status(500).json({ message: "Could not update habit" });
    }

    res.status(200).json({
      message: "Habit updated successfully",
      habit: updatedHabit,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteHabits = async (req, res) => {
  const { habitId } = req.params; // habitId comes from URL params like /habits/:habitId

  try {
    const habitExists = await Habit.findOne({ _id: habitId, user: req.user._id });
    if (!habitExists) {
      return res.status(404).json({ message: "Habit does not exist" });
    }

    await Habit.findByIdAndDelete(habitId);

    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { getHabits, createHabits, editHabits, deleteHabits };
