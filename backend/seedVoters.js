require("dotenv").config();

const mongoose = require("mongoose");
const Voter = require("./models/Voter");

const voters = [
    {
        epic: "ABC1234567",
        name: "Arun Kumar",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "12",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },
    {
        epic: "ABC1234568",
        name: "Priya Devi",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "12",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },
    {
        epic: "ABC1234569",
        name: "Rahul Kumar",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "12",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: true
    },
    {
        epic: "ABC1234570",
        name: "Meena S",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "12",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },
    {
        epic: "ABC1234571",
        name: "Kiran Raj",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "12",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },
    {
        epic: "ABC1234572",
        name: "Divya R",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "13",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },
    {
        epic: "ABC1234573",
        name: "Santhosh K",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "13",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },

    // NEW VOTERS

    {
        epic: "ABC1234574",
        name: "Vijay Kumar",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "13",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },
    {
        epic: "ABC1234575",
        name: "Anitha R",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "13",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },
    {
        epic: "ABC1234576",
        name: "Suresh B",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "14",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },
    {
        epic: "ABC1234577",
        name: "Lakshmi Devi",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "14",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },
    {
        epic: "ABC1234578",
        name: "Ajay Kumar",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "14",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },
    {
        epic: "ABC1234579",
        name: "Nandhini S",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "14",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },
    {
        epic: "ABC1234580",
        name: "Prakash M",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "15",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },
    {
        epic: "ABC1234581",
        name: "Deepa K",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "15",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },
    {
        epic: "ABC1234582",
        name: "Mohan Raj",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "15",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },
    {
        epic: "ABC1234583",
        name: "Kavitha R",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "15",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },
    {
        epic: "ABC1234584",
        name: "Ramesh K",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "16",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },
    {
        epic: "ABC1234585",
        name: "Swathi P",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "16",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    },
    {
        epic: "ABC1234586",
        name: "Hari Prasad",
        constituency: "Example Assembly Constituency",
        localBody: "Example Panchayat",
        ward: "16",
        district: "Example District",
        state: "Tamil Nadu",
        eligible: true,
        hasVoted: false
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected!");

        for (const voter of voters) {
            await Voter.updateOne(
                { epic: voter.epic },
                { $set: voter },
                { upsert: true }
            );
        }

        console.log(`${voters.length} voters added/updated successfully!`);

        await mongoose.connection.close();

    } catch (error) {
        console.error("Error:", error);
    }
}

seedDatabase();