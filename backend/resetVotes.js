require("dotenv").config();

const mongoose = require("mongoose");
const Voter = require("./models/Voter");

async function resetVotes() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected!");

        const result = await Voter.updateMany(
            {},
            { $set: { hasVoted: false } }
        );

        console.log(
            `Reset complete. ${result.modifiedCount} voter(s) reset.`
        );

        await mongoose.disconnect();

    } catch (error) {
        console.error("Reset failed:");
        console.error(error.message);
    }
}

resetVotes();