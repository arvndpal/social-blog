const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title is require',
        minlength: 4,
        maxlength: 150
    },
    body: {
        type: String,
        required: 'Body is require',
        minlength: 4,
        maxlength: 2000
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [
        {
            text: String,
            created: { type: Date, default: Date.now },
            postedBy: { type: ObjectId, ref: "User" }
        }
    ]

})

module.exports = mongoose.model('Post', postSchema)