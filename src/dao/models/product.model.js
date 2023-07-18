import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: Number, unique: true, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: [String], default: [] }
})
productSchema.plugin(mongoosePaginate)
mongoose.set("strictQuery", false);
export const productModel = mongoose.model(productCollection, productSchema)