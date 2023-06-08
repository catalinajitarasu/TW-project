const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    photo: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    mentions: {
        type: String
    }
});

module.exports = mongoose.model("Product", productSchema);