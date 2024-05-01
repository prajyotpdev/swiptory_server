const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    itemId: {
        type: ObjectId,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        unique: true,
    },
    colour: {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model("CartItem", cartItemSchema);