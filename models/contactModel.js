import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  message: {
    type: String,
  },
  phone: {
    type: Number,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
