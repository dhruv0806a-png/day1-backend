const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    name: "Dhruv",
    followers: 120,
    following: 100,
    bio: "backend developer",
    verified: true,
  });
});

router.get("/settings", (req, res) => {
  res.json({
    "private account": false,
    theme: "dark",
    "notifications on": true,
    "language preference": "english",
  });
});

router.get("/posts", (req, res) => {
  res.json([
    {
      id: 1,
      title: "first post",
      likes: 100,
      comments: 50,
    },
    {
      id: 2,
      title: "second post",
      likes: 150,
      comments: 70,
    },
  ]);
});

module.exports = router;
