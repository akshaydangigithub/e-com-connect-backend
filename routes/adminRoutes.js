import express from "express";
import {
  adminLogin,
  adminRegister,
  createProduct,
  readAllProducts,
  readSingleProduct,
  updateProduct,
  deleteProduct,
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

export default router;
