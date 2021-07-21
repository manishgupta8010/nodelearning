const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let TaskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: Number
    },
    Desc1: {
        type: String
    },
    Desc2: {
        type: String
    },
    colorCode: {
        type: String
    },
    icon: {
        type: String
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

TaskSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};
module.exports = mongoose.model("Task", TaskSchema, "Task");
