import AsyncHandler from "express-async-handler";
import ProductModel from "../models/productModel.js";

//? @desc     Fetch all products
//? @route    GET /api/products
//? @access     Public

export const getProducts = AsyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await ProductModel.count({ ...keyword });

  const products = await ProductModel.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//? @desc     Fetch single products
//? @route    GET /api/products/:id
//? @access     Public

export const getProductsById = AsyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await ProductModel.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

//? @desc    Delete a product
//? @route   DELETE /api/products/:id
//? @access  Private/Admin
export const deleteProduct = AsyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//? @desc    Create a product
//? @route   POST /api/products
//? @access  Private/Admin
export const createProduct = AsyncHandler(async (req, res) => {
  const product = new ProductModel({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStocks: 0,
    numReviews: 0,
    description: "Sample description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//? @desc    Update a product
//? @route   PUT /api/products/:id
//? @access  Private/Admin
export const updateProduct = AsyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStocks } =
    req.body;

  const product = await ProductModel.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStocks = countInStocks;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//? @desc    Create new review
//? @route   POST /api/products/:id/reviews
//? @access  Private
export const createProductReview = AsyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await ProductModel.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    // console.log(alreadyReviewed)

    if (alreadyReviewed) {
      alreadyReviewed.rating = Number(rating) || alreadyReviewed.rating;
      alreadyReviewed.comment = comment || alreadyReviewed.comment;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review updated" });
    } else {
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    }
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//? @desc    Get top rated products
//? @route   GET /api/products/top
//? @access  Public
export const getTopProducts = AsyncHandler(async (req, res) => {
  const products = await ProductModel.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});
