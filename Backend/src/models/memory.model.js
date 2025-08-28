const mongoose = require("mongoose")

const memorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    history: [
        {
            role: {
                type: String,
                enum: ["user", "model"],
                required: true,
            },
            text: {
                type: String,
                required: true
            }
        },
    ]
}, { timestamps: true });

module.exports = mongoose.model("Memory",memorySchema)