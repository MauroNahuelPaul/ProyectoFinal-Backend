import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    user: { type: String, required: true, unique: true },
    products: {
        type: [{
            _id: false,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"products"
            },
            quantity: Number,
        }],
        default: []
    }
})
cartSchema.pre("find",function(){
    this.populate("products.product")
})
mongoose.set("strictQuery", false);
export const cartModel = mongoose.model(cartCollection, cartSchema)