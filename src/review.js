const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    review: {
        type: String,
        required: true
    }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
