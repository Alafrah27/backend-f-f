import APIFeatures from "../lib/ApiFeautres.js";
import cloudinary from "../lib/claudinary.js";
import Category from "../model/Category.model.js";
import Product from "../model/Product.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, discount, category } = req.body;

    // Validate the category
    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      return res.status(400).json({ message: "Invalid category" });
    }

    let imageUrl = null;

    // Upload image to Cloudinary if provided
    if (image) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(image);
        imageUrl = cloudinaryResponse.secure_url;
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error.message);
        return res
          .status(500)
          .json({ message: "Failed to upload image", error: error.message });
      }
    }

    // Create the product object
    const product = new Product({
      name,
      description,
      price,
      discount,
      image: imageUrl,
      category: categoryDoc._id, // Use the ObjectId from found category
    });

    // Save the product to the database
    await product.save();
    return res.status(201).json(product); // Return the created product
  } catch (error) {
    console.error("Error in createProduct controller:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const features = new APIFeatures(
      Product.find().populate("category", "name ").sort({ createdAt: -1 }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query;
    res.json(products);
  } catch (error) {
    console.log("Error in getAllProduct controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const postId = req.params.id;
    const product = await Product.findById(postId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.image) {
      await cloudinary.uploader.destroy(
        product.image.split("/").pop().split(".")[0]
      );
    }
    await Product.findByIdAndDelete(postId);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "faild to delete product" });
    console.log(error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const products = await Product.findById(productId);
    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }
    const allowedFields = [
      "name",
      "description",
      "price",
      "discount",
      "image",
      "category",
    ];

    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field]) {
        updateData[field] = req.body[field];
      }
    }

    if (req.body.image) {
      // Ensure field names match
      try {
        const result = await cloudinary.uploader.upload(req.body.image);
        updateData.image = result.secure_url;
      } catch (error) {
        res.status(400).json({ message: "image can not be uploaded" });
      }
    }

    const product = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
