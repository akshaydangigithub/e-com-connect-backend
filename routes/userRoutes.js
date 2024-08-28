import express from "express";
import {
  userRegister,
  loginUser,
  getUserById,
  addToCart,
  removeFromCart,
  cancelOrder,
  orderProduct,
} from "../controller/userController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("User Route");
});

router.post("/register", userRegister);

router.post("/login", loginUser);

router.get("/:id", getUserById);

router.post("/add-to-cart/:userId/:productId", addToCart);

router.post("/remove-from-cart/:userId/:productId", removeFromCart);

router.post("/order/:userId/:productId", orderProduct);

router.post("/cancel-order/:userId/:productId", cancelOrder);

export default router;
