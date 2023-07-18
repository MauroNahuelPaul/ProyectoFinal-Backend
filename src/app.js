import express, { request } from "express";
import handlebars from "express-handlebars"
import mongoose from "mongoose";
import { Server } from 'socket.io'

import productRouter from "./routers/product.router.js"
import chatRouter from "./routers/chat.router.js"
import viewsProductsRouter from "./routers/views.router.js";
import cartRouter from "./routers/cart.router.js"


const app = express();
app.use(express.json());

(async () => {
    try {
        await mongoose.connect('mongodb+srv://mauro:mauro@ecommerce.wnnj4ej.mongodb.net/?retryWrites=true&w=majority')
        const serverHttp = app.listen(8080, () => console.log("Server Up"))
        const io = new Server(serverHttp)
        app.set("socketio", io);

        app.engine("handlebars", handlebars.engine());
        app.set("views", "./src/views");
        app.set("view engine", "handlebars");

        app.use("/", viewsProductsRouter);
        app.use("/api/chat", chatRouter);
        app.use("/api/products", productRouter);
        app.use("/api/cart", cartRouter)



        io.on('connection', async socket => {
            //cart
            const resultCart = await fetch("http://localhost:8080/api/cart")
            const dataCart = await resultCart.json()
            io.emit("updatedCart", dataCart.payload);
            socket.on("updatedCart", async () => {
                const resultCart = await fetch("http://localhost:8080/api/cart")
                const dataCart = await resultCart.json()
                io.emit("updatedCart", dataCart.payload);
            });
            //Chat
            const resultChat = await fetch("http://localhost:8080/api/chat")
            const dataChat = await resultChat.json()
            io.emit("updatedChat", dataChat.payload);
            socket.on("updatedChat", async () => {
                const resultChat = await fetch("http://localhost:8080/api/chat")
                const dataChat = await resultChat.json()
                io.emit("updatedChat", dataChat.payload);
            });
            //Products
            
            if (socket.request.headers.referer.split("?")[0] == "http://localhost:8080/products") {
                const paramsProduct = socket.request.headers.referer.split("?")[1]
                const resultProducts = await fetch(`http://localhost:8080/api/products?${paramsProduct}`)
                const dataProducts = await resultProducts.json()
                io.emit("updatedProducts", dataProducts);
            }
            else {
                const resultProducts = await fetch(`http://localhost:8080/api/products`)
                const dataProducts = await resultProducts.json()
                io.emit("updatedProducts", dataProducts);
            }

            socket.on("updatedProducts", async () => {
                if (socket.request.headers.referer.split("?")[0] == "http://localhost:8080/products") {
                    const paramsProduct = socket.request.headers.referer.split("?")[1]
                    const resultProducts = await fetch(`http://localhost:8080/api/products?${paramsProduct}`)
                    const dataProducts = await resultProducts.json()              
                    io.emit("updatedProducts", dataProducts);
                }
                else {
                    const resultProducts = await fetch(`http://localhost:8080/api/products`)
                    const dataProducts = await resultProducts.json()
                    io.emit("updatedProducts", dataProducts);
                }
            });
        })
    } catch (err) {
        console.log(err)
    }
})()

