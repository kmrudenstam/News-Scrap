// Dependencies
const mongoose = require("mongoose");

// Create Schema for db
const Schema = mongoose.Schema;
const ArticleSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    link: {
        type: String,
        required: true
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comments"
    }]
})

const Article = mongoose.model("Articles", ArticleSchema);

module.exports = Article;