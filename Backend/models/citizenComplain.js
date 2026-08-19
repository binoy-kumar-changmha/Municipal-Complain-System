const mongoose = require("mongoose");

const complainSchema = new mongoose.Schema(

    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected", "Resolved"],
            default: "Pending",
            required: true
        }
    },
    {
        timestamps: true,
    }

)

const complain = mongoose.model('complain', complainSchema);
module.exports = complain;