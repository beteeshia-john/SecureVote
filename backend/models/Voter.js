const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema({
    epic: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    constituency: {
        type: String,
        required: true
    },

    localBody: {
        type: String,
        required: true
    },

    ward: {
        type: String,
        required: true
    },

    district: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    eligible: {
        type: Boolean,
        required: true
    },

    hasVoted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Voter", voterSchema);