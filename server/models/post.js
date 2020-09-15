const mongoose = require("mongoose")

var postSchema = mongoose.modelSchema({
    title: {
        type: String,
        required: true
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
    }
})

module.exports = mongoose.model('PostSchema', postSchema);