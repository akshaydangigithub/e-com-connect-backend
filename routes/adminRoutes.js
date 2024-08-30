import express from "express";
import {
  adminLogin,
  adminRegister,
  createProduct,
  readAllProducts,
  readSingleProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  getAllOrders,
  cancelOrder
} from "../controller/adminController.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from admin routes!");
});

router.post("/register", adminRegister);
router.post("/login", adminLogin);

// create product
router.post("/product", isAdmin, createProduct);

// read all products
router.get("/product/read/all", readAllProducts);

// read single product
router.get("/product/read/:productId", readSingleProduct);

// update product
router.put("/product/update/:productId", isAdmin, updateProduct);

// delete product
router.delete("/product/delete/:productId", isAdmin, deleteProduct);

router.get("/getAllUsers", isAdmin, getAllUsers);

router.get("/getAllOrders", isAdmin, getAllOrders);

router.post("/cancelOrder/:orderId", isAdmin, cancelOrder);

export default router;
