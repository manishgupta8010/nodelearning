const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let PublisherSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    mobile: {
        type: Number
    },
    isActive: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Number,
        default: () => Date.now()
    }
});
PublisherSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};
module.exports = mongoose.model("Publisher", PublisherSchema, "Publisher");
