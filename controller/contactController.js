import { errorResponse, successResponse } from "../middlewares/responses.js";
import Contact from "../models/contactModel.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, message, phone } = req.body;

    switch (true) {
      case !name:
        return errorResponse(res, "Name is required", 400);
      case !email:
        return errorResponse(res, "Email is required", 400);
      case !message:
        return errorResponse(res, "Message is required", 400);
      case !phone:
        return errorResponse(res, "Phone is required", 400);
    }

    const contact = new Contact({
      name,
      email,
      message,
      phone,
    });

    if (!contact) {
      return errorResponse(res, "Contact not created", 500);
    }

    await contact.save();

    return successResponse(res, "Contact created successfully !", contact, 201);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error);
  }
};

export const getAllContact = async (req, res) => {
  try {
    const contacts = await Contact.find();

    if (!contacts) {
      return errorResponse(res, "No contact found", 404);
    }

    return successResponse(res, "All contacts", contacts, 200);
  } catch (error) {
    return errorResponse(res, "Internal server error", 500, error);
  }
};
