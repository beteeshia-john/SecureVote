const express = require("express");
const Voter = require("../models/Voter");
const ethers = require("ethers");

const router = express.Router();

// =====================================================
// SECUREVOTE BLOCKCHAIN SETTINGS
// =====================================================

// We will replace this with the NEW contract address
// after you deploy the new contract in Remix.
const contractAddress = "0x43ea41dceb4699561b4e2f0d2c200abf26296e21";

// Sepolia chain ID
const chainId = 11155111;

// Create the backend signing wallet
const signer = new ethers.Wallet(
    process.env.SIGNER_PRIVATE_KEY
);


// =====================================================
// GET VOTER
// =====================================================

router.get("/:epic", async (req, res) => {

    try {

        const epic = req.params.epic.toUpperCase();

        const voter = await Voter.findOne({
            epic: epic
        });

        if (!voter) {
            return res.status(404).json({
                message: "Voter not found"
            });
        }

        res.json(voter);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =====================================================
// AUTHORIZE BLOCKCHAIN VOTE
// =====================================================

router.post("/:epic/authorize", async (req, res) => {

    try {

        const epic = req.params.epic.toUpperCase();

        const { candidateId } = req.body;

        const candidate = Number(candidateId);


        // Check candidate
        if (![1, 2, 3].includes(candidate)) {

            return res.status(400).json({
                message: "Invalid candidate"
            });
        }


        // Find voter in MongoDB
        const voter = await Voter.findOne({
            epic: epic
        });

        if (!voter) {

            return res.status(404).json({
                message: "Voter not found"
            });
        }


        // Check eligibility
        if (!voter.eligible) {

            return res.status(403).json({
                message: "Voter is not eligible"
            });
        }


        // Check whether voter already voted
        if (voter.hasVoted) {

            return res.status(409).json({
                message: "Vote already cast"
            });
        }


        // Hash the voter ID
        const voterIdHash = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(epic)
        );


        // Create the exact message that the smart contract expects
        const messageHash = ethers.utils.solidityKeccak256(
            [
                "bytes32",
                "uint256",
                "address",
                "uint256"
            ],
            [
                voterIdHash,
                candidate,
                contractAddress,
                chainId
            ]
        );


        // Sign the message using the backend private key
        const signature = await signer.signMessage(
            ethers.utils.arrayify(messageHash)
        );


        // Send authorization to frontend
        res.json({

            voterIdHash: voterIdHash,

            candidateId: candidate,

            signature: signature

        });

    } catch (error) {

        console.error("Authorization error:", error);

        res.status(500).json({
            message: "Could not authorize vote"
        });
    }
});


// =====================================================
// RECORD VOTE IN MONGODB
// =====================================================

router.post("/:epic/vote", async (req, res) => {

    try {

        const epic = req.params.epic.toUpperCase();

        const { candidate } = req.body;


        const allowedCandidates = [
            "Candidate A",
            "Candidate B",
            "Candidate C"
        ];


        if (!allowedCandidates.includes(candidate)) {

            return res.status(400).json({
                message: "Invalid candidate"
            });
        }


        const voter = await Voter.findOne({
            epic: epic
        });


        if (!voter) {

            return res.status(404).json({
                message: "Voter not found"
            });
        }


        if (!voter.eligible) {

            return res.status(403).json({
                message: "Voter is not eligible"
            });
        }


        if (voter.hasVoted) {

            return res.status(409).json({
                message: "Vote already cast"
            });
        }


        // Mark voter as having voted
        voter.hasVoted = true;

        await voter.save();


        res.json({

            message: "Vote recorded successfully",

            epic: voter.epic

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;