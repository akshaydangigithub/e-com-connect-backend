import mongoose from "mongoose";
// import Admin from "../models/adminModel.js";
// import { errorResponse } from "../middlewares/responses.js";

const ConnectDb = async (MONGO_URL) => {
  try {
    await mongoose.connect(MONGO_URL);

    console.log("Connected to the database successfully !");
    // initial();
  } catch (error) {
    console.log(error, "Error while connecting to the database");
  }
};

// const initial = async () => {
//   try {
//     const admin = await Admin.findById({ _id: "66bcbed622ee36d3bcc2bc35" });

//     if (!admin) {
//       await Admin.create({
//         _id: "66bcbed622ee36d3bcc2bc35",
//         email: "admin@gmail.com",
//         password:
//           "$2b$10$SPFREnsA6Augm64GlueZle24Jf/Men1TFI357thA3gPLkU8hNVHzS", // password 123
//         role: "admin",
//       });
//     }

//     console.log("Admin Already Created");
//   } catch (error) {
//     return errorResponse(res, "Internal server error", 500, error);
//   }
// };

export default ConnectDb;
