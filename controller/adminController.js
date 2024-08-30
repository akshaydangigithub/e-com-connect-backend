import { errorResponse, successResponse } from "../middlewares/responses.js";
import Admin from "../models/adminModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Product from "../models/productModel.js";
import { imagekit } from "../middlewares/imagekit.js";

export const adminRegister = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    switch (true) {
      case !email:
        return errorResponse(res, "Email is required!", 400);
      case !password:
        return errorResponse(res, "Password is required!", 400);
      case !role:
        return errorResponse(res, "Role is required!", 400);
    }

    const adminAlreadyExists = await Admin.findOne({ email });

    if (adminAlreadyExists) {
      return errorResponse(res, "Admin already registered", 400);
    }

    if (role === "admin") {
      return errorResponse(res, "Admin already exists", 400);
    }

    const hash = bcrypt.hashSync(password, 10);

    const admin = await Admin.create({
      email,
      password: hash,
      role,
    });

    if (!admin) {
      return errorResponse(res, "Error while creatind admin");
    } else {
      return successResponse(res, "Admin created successfully !", admin, 201);
    }
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error);
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    switch (true) {
      case !email:
        return errorResponse(res, "Email is required!", 400);
      case !password:
        return errorResponse(res, "Password is required!", 400);
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return errorResponse(res, "Admin not found", 400);
    }

    const isMatched = bcrypt.compareSync(password, admin.password);

    if (!isMatched) {
      return errorResponse(res, "Invalid Credentials !", 400);
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: "Admin loggedIn successfully !",
      token,
    });
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error);
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      about,
      category,
      sku,
      tags,
      description,
      weight,
      dimensions,
      size,
      colors,
    } = req.body;

    switch (true) {
      case !name:
        return errorResponse(res, "Name is required!", 400);

      case !price:
        return errorResponse(res, "Price is required!", 400);

      case !about:
        return errorResponse(res, "About is required!", 400);

      case !category:
        return errorResponse(res, "Category is required!", 400);

      case !sku:
        return errorResponse(res, "SKU is required!", 400);

      case !description:
        return errorResponse(res, "Description is required!", 400);

      case !weight:
        return errorResponse(res, "Weight is required!", 400);

      case !dimensions:
        return errorResponse(res, "Dimensions is required!", 400);

      case !size:
        return errorResponse(res, "Size is required!", 400);
    }

    const files = req.files.images;

    if (!files || (Array.isArray(files) && files.length === 0)) {
      return errorResponse(res, "Images Are Required !", 400);
    }

    const fileArray = Array.isArray(files) ? files : [files];

    const tagsArray = Array.isArray(tags) ? tags : [tags];
    const colorsArray = Array.isArray(colors) ? colors : [colors];

    const images = [];

    for (const file of fileArray) {
      const result = await imagekit.upload({
        file: file.data,
        fileName: file.name,
      });

      images.push({
        fileId: result.fileId,
        url: result.url,
      });
    }

    const newProduct = await new Product({
      images,
      name,
      price,
      about,
      category,
      sku,
      tags: tagsArray,
      description,
      weight,
      dimensions,
      size,
      colors: colorsArray,
    });

    await newProduct.save();

    if (!newProduct) {
      return errorResponse(res, "Error while creating new product", 400);
    }

    return successResponse(
      res,
      "Product Created Successfully ",
      newProduct,
      201
    );
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error);
  }
};

export const readAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return errorResponse(res, "Products not found !", 400);
    }
    return successResponse(res, "Products Found Successfully", products, 200);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error);
  }
};

export const readSingleProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);

    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }

    return successResponse(res, "Product found Successfully", product, 200);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      about,
      category,
      sku,
      tags,
      description,
      weight,
      dimensions,
      size,
      colors,
    } = req.body;

    const productId = req.params.productId;

    const product = await Product.findById(productId);

    if (!product) return errorResponse(res, "Product not fount", 404);

    if (req.files) {
      product.images.map(async (image) => {
        await imagekit.deleteFile(image.fileId);
      });

      const files = req.files.images;

      const fileArray = Array.isArray(files) ? files : [files];

      const images = [];

      for (const file of fileArray) {
        const result = await imagekit.upload({
          file: file.data,
          fileName: file.name,
        });

        images.push({
          fileId: result.fileId,
          url: result.url,
        });
      }

      product.images = images;
    }

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (about !== undefined) product.about = about;
    if (category !== undefined) product.category = category;
    if (sku !== undefined) product.sku = sku;

    if (tags !== undefined) {
      if (tags.length > 0) {
        tags.map((tag, index) => {
          product.tags[index] = tag;
        });
      }
    }

    if (description !== undefined) product.description = description;
    if (weight !== undefined) product.weight = weight;
    if (dimensions !== undefined) product.dimensions = dimensions;
    if (size !== undefined) product.size = size;

    if (colors !== undefined) {
      if (colors.length > 0) {
        colors.map((color, index) => {
          product.colors[index] = color;
        });
      }
    }

    await product.save();

    return successResponse(res, "Product updated successfully", product, 201);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);

    if (!product) return errorResponse(res, "Product Not Found", 404);

    product.images.map(async (img) => {
      await imagekit.deleteFile(img.fileId);
    });

    await product.deleteOne();

    return successResponse(res, "Product deleted successfully", null, 200);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return errorResponse(res, "No users found", 404);
    }

    return successResponse(res, "Users found successfully", users, 200);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error);
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("product").populate("user");

    if (!orders || orders.length === 0) {
      return errorResponse(res, "No orders found", 404);
    }

    return successResponse(res, "Orders found successfully", orders, 200);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error);
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return errorResponse(res, "Order not found", 404);
    }

    const user = await User.findById(order.user);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    order.status = "Cancelled";

    user.orders.pop(order.product);

    await order.save();
    await user.save();

    return successResponse(res, "Order cancelled successfully", null, 200);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error);
  }
};
