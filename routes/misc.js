const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

router.get("/about", (req, res) => {
  res.json({ status: "ok" });
});
router.get("/contact", (req, res) => {
  res.json({ status: "ok" });
});

router.get("/help", (req, res) => {
  res.json({ status: "ok" });
});

router.get("/student", (req, res) => {
  res.json({ name: "Dhruv", age: 21, college: "VIT", branch: "CSE" });
});
router.get("/teacher", (req, res) => {
  res.json({ name: "Reenu", department: "CSE" });
});
router.get("/course", (req, res) => {
  res.json({
    name: "Web development",
    duration: "10 days",
    faculty: "Dhruv",
    topics: ["HTML", "css", "js"],
  });
});

router.get("/add/:a/:b", (req, res) => {
  const a = parseInt(req.params.a);
  const b = parseInt(req.params.b);
  if (isNaN(a)) {
    return res.status(400).json({
      error: "a is not a number",
    });
  }
  if (isNaN(b)) {
    return res.status(400).json({
      error: "b is not a number",
    });
  }
  const sum = a + b;
  res.json({
    sum: sum,
  });
});

router.get("/subtract/:a/:b", (req, res) => {
  const a = parseInt(req.params.a);
  const b = parseInt(req.params.b);
  const difference = a - b;
  res.json({
    difference: difference,
  });
});

router.get("/multiply/:a/:b", (req, res) => {
  const a = parseInt(req.params.a);
  const b = parseInt(req.params.b);
  const product = a * b;
  res.json({
    product: product,
  });
});
router.get("/divide/:a/:b", (req, res) => {
  const a = parseInt(req.params.a);
  const b = parseInt(req.params.b);
  if (b === 0) {
    res.status(400).json({
      error: "Division by zero is not allowed",
    });
  }
  const quotient = a / b;
  res.json({
    division: quotient,
  });
});

router.get("/check-age/:age", (req, res) => {
  const age = Number(req.params.age);
  if (isNaN(age)) {
    return res.status(400).json({
      error: "Age must be a number",
    });
  }
  if (age >= 18) {
    return res.json({
      age: age,
      eligible: true,
      message: "You are eligible for the driving license",
    });
  } else {
    return res.json({
      age: age,
      eligible: false,
      message: "You are not eligible for the driving license",
    });
  }
});

router.get(
  "/async-test",
  asyncHandler(async (req, res) => {
    await new Promise((r) => setTimeout(r, 500));
    throw new Error("Async error caught!");
  }),
);

module.exports = router;
