import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorResponse, successResponse } from "../middlewares/responses.js";

export const userRegister = async (req, res) => {
  try {
    const { name, email, password, userName, role, phone } = req.body;

    switch (true) {
      case !name:
        return errorResponse(res, "Name is required", 400);
      case !email:
        return errorResponse(res, "Email is required", 400);
      case !password:
        return errorResponse(res, "Password is required", 400);
      case !userName:
        return errorResponse(res, "UserName is required", 400);
      case !phone:
        return errorResponse(res, "Phone is required", 400);
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return errorResponse(res, "Email already exists", 400);
    }

    const exitUsername = await User.findOne({ userName });

    if (exitUsername) {
      return errorResponse(res, "Username already exists", 400);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userName,
      role,
      phone,
    });

    await newUser.save();

    if (!newUser) {
      return errorResponse(res, "User not created", 500);
    }

    return successResponse(res, "User created successfully !", newUser, 201);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    switch (true) {
      case !email:
        return errorResponse(res, "Email is required", 400);
      case !password:
        return errorResponse(res, "Password is required", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, "Password or Email is incorrect", 400);
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return errorResponse(res, "Password or Email is incorrect", 400);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .populate("cart")
      .populate("orders");

    if (!user) return errorResponse(res, "User not found", 404);

    return successResponse(res, "User found", user, 200);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, userId } = req.params;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user) return errorResponse(res, "User not found", 404);
    if (!product) return errorResponse(res, "Product not found", 404);

    user.cart.push(product._id);

    await user.save();

    return successResponse(
      res,
      "Item added into the cart successfully !",
      null,
      200
    );
  } catch (error) {
    return errorResponse(res, "Internal server error", 500);
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId, userId } = req.params;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user) return errorResponse(res, "User not found", 404);
    if (!product) return errorResponse(res, "Product not found", 404);

    user.cart.pop(productId);

    await user.save();

    return successResponse(
      res,
      "Item removed from the cart successfully !",
      null,
      200
    );
  } catch (error) {
    return errorResponse(res, "Internal server error", 500);
  }
};

export const orderProduct = async (req, res) => {
  try {
    const { productId, userId } = req.params;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user) return errorResponse(res, "User not found", 404);
    if (!product) return errorResponse(res, "Product not found", 404);

    const order = new Order({
      product: productId,
      user: userId,
    });

    if (!order) return errorResponse(res, "Error while order the product", 500);

    await order.save();
    user.orders.push(product._id);

    await user.save();

    return successResponse(res, "Product Ordered successfully !", null, 200);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500);
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { productId, userId } = req.params;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user) return errorResponse(res, "User not found", 404);
    if (!product) return errorResponse(res, "Product not found", 404);

    user.orders.pop(product._id);

    await user.save();

    return successResponse(res, "Order cancel successfully !", null, 200);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500);
  }
};
