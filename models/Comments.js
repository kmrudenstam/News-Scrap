// Dependencies
const mongoose = require("mongoose");

// Create Schema for db
const Schema = mongoose.Schema;
const CommentSchema = new Schema({
    name: {
        type: String,
    },
    body: {
        type: String,
        required: true
    },

})

const Comment = mongoose.model("comments", CommentSchema);

module.exports = Comment;