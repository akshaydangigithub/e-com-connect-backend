import express from "express";
import dotenv from "dotenv";
import ConnectDb from "./config/db.js";
const app = express();

dotenv.config();

const PORT = process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import fileUpload from "express-fileupload";
app.use(fileUpload());
// =============================== Routes ================================

import indexRoutes from "./routes/indexRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);


// ================================ Routes End ============================


ConnectDb(process.env.MONGO_URL);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
