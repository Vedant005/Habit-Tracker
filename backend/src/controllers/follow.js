import User from "./../models/user.js"
import CheckIn from "./../models/checkIn.js"


// POST /:userId/follow
export const followUser = async (req, res) => {
  const { userId } = req.params;

  try {
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.friends.includes(userId)) {
      return res.status(409).json({ message: "Already following this user" });
    }

    req.user.friends.push(userId);
    await req.user.save();

    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /:userId/unfollow
export const unfollowUser = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!req.user.friends.includes(userId)) {
      return res.status(404).json({ message: "You are not following this user" });
    }

    req.user.friends = req.user.friends.filter(
      (friendId) => friendId.toString() !== userId
    );
    await req.user.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /:userId/following
export const getFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("friends", "name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ following: user.friends });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /feed
export const getFeed = async (req, res) => {
  try {
    // Fetch recent check-ins by followed users
    const checkIns = await CheckIn.find({
      user: { $in: req.user.friends },
    })
      .populate("user", "name email")
      .populate("habit", "name category frequency")
      .sort({ timestamp: -1 })
      .limit(50);

    res.status(200).json({ feed: checkIns });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
