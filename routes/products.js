const express = require("express");
const router = express.Router();
const checkApiKey = require("../middleware/checkApiKey");
const AppError = require("../middleware/AppError");
const asyncHandler = require("../middleware/asyncHandler");
const Product = require("../models/Product");

router.use(checkApiKey);

const MAX_PRODUCTS = Number(process.env.MAX_PRODUCTS) || 100;

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { category, minPrice, maxPrice, sort, order, page, limit } =
      req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Build query
    let query = Product.find(filter);

    // Sorting
    if (sort) {
      const dir = order === "desc" ? -1 : 1;
      query = query.sort({ [sort]: dir });
    }

    // Pagination
    if (page && limit) {
      const p = Number(page);
      const l = Number(limit);
      query = query.skip((p - 1) * l).limit(l);
    }

    const products = await query;
    res.json({ products });
  }),
);
/*router.get("/:id", (req, res, next) => {
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
});*/

router.post(
  "/",
  asyncHandler(async (req, res, next) => {
    const count = await Product.countDocuments();

    if (count >= MAX_PRODUCTS) {
      return next(new AppError("Product limit reached", 400));
    }
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  }),
);
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ product });
  }),
);
router.put(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return next(new AppError("Product not found", 404));
    }

    res.json({ product: updated });
  }),
);
router.delete(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const removed = await Product.findByIdAndDelete(req.params.id);

    if (!removed) {
      return next(new AppError("Product not found", 404));
    }

    res.json({ message: "Product deleted", product: removed });
  }),
);
module.exports = router;
