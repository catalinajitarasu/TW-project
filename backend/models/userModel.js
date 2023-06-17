const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    registerDate:{
        type: Date,
        default: new Date()
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
    diet:{
        type: String,
    },
    allergies:[{
        type: String,
    }],
    preferences:[{
        type: String,
    }],
    cart:[{
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    }],
    favorites:[{
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    }]
});

module.exports = mongoose.model("User", userSchema);