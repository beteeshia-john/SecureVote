require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const voterRoutes = require("./routes/voterRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// =====================================================
// API ROUTES
// =====================================================

app.use("/api/voters", voterRoutes);

app.get("/api/test", (req, res) => {

    res.json({
        message: "SecureVote backend is running!"
    });

});


// =====================================================
// SERVE FRONTEND
// =====================================================

app.use(
    express.static(
        path.join(__dirname, "..")
    )
);


// =====================================================
// START SERVER
// =====================================================

async function startServer() {

    try {

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            "MongoDB connected successfully!"
        );


        app.listen(
            PORT,
            "0.0.0.0",
            () => {

                console.log(
                    `SecureVote running on port ${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "MongoDB connection failed:"
        );

        console.error(
            error.message
        );
    }
}

startServer();