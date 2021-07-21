const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let AuthorSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    createdAt: {
        type: Number,
        default: () => Date.now()
    }
});
AuthorSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};
module.exports = mongoose.model("Author", AuthorSchema, "Author");
