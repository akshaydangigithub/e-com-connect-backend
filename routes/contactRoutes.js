import express from "express";
import { createContact ,getAllContact} from "../controller/contactController.js";

const router = express.Router();

router.post("/create", createContact);

router.get("/readAll", getAllContact)

export default router;
