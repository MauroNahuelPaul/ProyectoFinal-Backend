import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";
import { messageModel } from "../dao/models/message.model.js";

const router = Router();

router.get("/products", async (req, res) => {
  res.render("products");
});

router.get("/chat", async (req, res) => {
    res.render("chat");
});

router.get("/cart", async (req, res) => {
  res.render("cart");
});

export default router;
