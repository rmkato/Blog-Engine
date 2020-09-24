const mongoose = require("mongoose")

var postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }, 
    tags: {
        type: Array,
        required: false,
        trim: true
    }
})

module.exports = mongoose.model('PostSchema', postSchema);