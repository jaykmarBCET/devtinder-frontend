const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    } else {
      // NEW: Mark all messages from the other user as seen
      await Chat.findOneAndUpdate(
        {
          participants: { $all: [userId, targetUserId] },
          "messages.senderId": targetUserId,
        },
        { $set: { "messages.$[elem].isSeen": true } },
        {
          arrayFilters: [{ "elem.isSeen": false }],
          new: true,
        }
      );
      // Reload the chat to get the updated status
      chat = await Chat.findOne({
        participants: { $all: [userId, targetUserId] },
      }).populate({
        path: "messages.senderId",
        select: "firstName lastName",
      });
    }

    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = chatRouter;