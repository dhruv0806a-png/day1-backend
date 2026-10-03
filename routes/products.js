const express = require("express");
const router = express.Router();
const checkApiKey = require("../middleware/checkApiKey");
const AppError = require("../middleware/AppError");

router.use(checkApiKey);

const products = require("../data/products");
const MAX_PRODUCTS = Number(process.env.MAX_PRODUCTS) || 100;

router.get("/", (req, res) => {
  const { category, minPrice, maxPrice, sort, order, page, limit } = req.query;

  let result = [...products];

  if (category) {
    result = result.filter((p) => p.category === category);
  }
  if (minPrice) {
    const min = Number(minPrice);
    result = result.filter((p) => p.price >= min);
  }
  if (maxPrice) {
    const max = Number(maxPrice);
    result = result.filter((p) => p.price <= max);
  }
  if (sort) {
    const dir = order === "desc" ? -1 : 1;
    result = [...result].sort((a, b) => (a[sort] - b[sort]) * dir);
  }

  if (page && limit) {
    const p = Number(page);
    const l = Number(limit);
    const start = (p - 1) * l;
    result = result.slice(start, start + l);
  }
  res.json({ products: result });
});
router.get("/:id", (req, res, next) => {
  const id = Number(req.params.id);
  const found = products.find((p) => p.id === id);
  if (!found) {
    return next(new AppError("Product not found", 404));
  } else {
    return res.json({ product: found });
  }
});
router.post("/", (req, res, next) => {
  const newProduct = req.body;

  if (
    !newProduct.name ||
    !newProduct.price ||
    !newProduct.category ||
    !newProduct.stock
  ) {
    return next(new AppError("Missing required fields", 400));
  }
  if (products.length >= MAX_PRODUCTS) {
    return next(new AppError("Product Limit Reached", 400));
  }
  const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
  const finalProduct = {
    id: newId,
    ...newProduct,
  };
  products.push(finalProduct);
  return res.status(201).json({
    product: finalProduct,
  });
});

router.put("/:id", (req, res, next) => {
  const id = Number(req.params.id);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return next(new AppError("Product not found", 404));
  }
  const updated = { ...products[index], ...req.body, id: id };
  products[index] = updated;
  return res.status(200).json({
    product: updated,
  });
});
router.delete("/:id", (req, res, next) => {
  const id = Number(req.params.id);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return next(new AppError("Product not found", 404));
  }
  const removed = products.splice(index, 1)[0];
  return res.json({ message: "Product deleted", product: removed });
});
module.exports = router;
