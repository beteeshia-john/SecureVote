/* =========================================================
   SECUREVOTE - BLOCKCHAIN CONFIGURATION
========================================================= */
const API_BASE_URL =
    "https://securevote-6t15.onrender.com";
const contractAddress =
    "0x43ea41dceb4699561b4e2f0d2c200abf26296e21";

const contractABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_authorizedSigner",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "voterIdHash",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "candidateId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "signature",
                "type": "bytes"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "voterIdHash",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "candidateId",
                "type": "uint256"
            }
        ],
        "name": "VoteCast",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "authorizedSigner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "candidateACount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "candidateBCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "candidateCCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getResults",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "candidateA",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "candidateB",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "candidateC",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "hasVoted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];


/* =========================================================
   CURRENT SESSION
========================================================= */

let currentTestId = null;
let currentVoter = null;
let selectedCandidate = null;


/* =========================================================
   SHOW SECTION
========================================================= */

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".page-section");

    sections.forEach(section => {
        section.classList.add("hidden");
    });

    const section =
        document.getElementById(sectionId);

    if (section) {

        section.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}


/* =========================================================
   SHOW / HIDE VOTER ID
========================================================= */

function toggleVoterId() {

    const input =
        document.getElementById("identityInput");

    const button =
        document.getElementById("toggleIdButton");

    if (input.type === "password") {

        input.type = "text";
        button.textContent = "Hide";

    } else {

        input.type = "password";
        button.textContent = "Show";
    }
}


/* =========================================================
   VERIFY VOTER ID
========================================================= */

async function verifyIdentity() {

    const input =
        document.getElementById("identityInput");

    const voterId =
        input.value.trim().toUpperCase();

    if (!voterId) {

        alert("Please enter your Voter ID.");
        return;
    }

    try {

        const response = await fetch(`${API_BASE_URL}/api/voters/${voterId}`);


        if (response.status === 404) {

            alert("Voter not found.");
            return;
        }

        if (!response.ok) {

            alert("Unable to verify voter.");
            return;
        }

        const voter =
            await response.json();

        currentVoter = voter;
        currentTestId = voter.epic;

        // Check eligibility
        if (!voter.eligible) {

            alert("Voter is not eligible.");
            return;
        }

        // Check MongoDB voting status
        if (voter.hasVoted) {

            alert("Vote Already Cast.");
            return;
        }

        // Display voter information
        document.getElementById("voterName").textContent =
            voter.name;

        document.getElementById("verifiedVoterId").textContent =
            voter.epic;

        document.getElementById("constituency").textContent =
            voter.constituency;

        document.getElementById("localBody").textContent =
            voter.localBody;

        document.getElementById("ward").textContent =
            voter.ward;

        document.getElementById("district").textContent =
            voter.district;

        document.getElementById("state").textContent =
            voter.state;

        showSection("eligibility-section");

    } catch (error) {

        console.error(
            "Voter verification error:",
            error
        );

        alert(
            "Could not connect to the SecureVote server."
        );
    }
}


/* =========================================================
   PROCEED TO BALLOT
========================================================= */

function proceedToVoting() {

    showSection("voting-section");
}


/* =========================================================
   SELECT CANDIDATE
========================================================= */

function selectCandidate(
    element,
    candidateName
) {

    const candidates =
        document.querySelectorAll(".candidate");

    candidates.forEach(candidate => {

        candidate.classList.remove("selected");

    });

    element.classList.add("selected");

    selectedCandidate =
        candidateName;

    const confirmButton =
        document.getElementById("confirmVoteButton");

    if (confirmButton) {

        confirmButton.disabled = false;
    }
}


/* =========================================================
   CONFIRM VOTE
========================================================= */

async function confirmVote() {

    if (!currentTestId) {

        alert(
            "Please complete voter authentication first."
        );

        return;
    }

    if (!selectedCandidate) {

        alert(
            "Please select a candidate."
        );

        return;
    }

    const confirmButton =
        document.getElementById("confirmVoteButton");

    if (confirmButton) {

        confirmButton.disabled = true;
    }

    try {

        /* ================================================
           STEP 1 - CHECK METAMASK
        ================================================= */

        if (
            typeof window.ethereum === "undefined"
        ) {

            alert(
                "Please install or unlock MetaMask."
            );

            if (confirmButton) {
                confirmButton.disabled = false;
            }

            return;
        }


        /* ================================================
           STEP 2 - CONNECT METAMASK
        ================================================= */

        await window.ethereum.request({
            method: "eth_requestAccounts"
        });


        const provider =
            new ethers.providers.Web3Provider(
                window.ethereum
            );

        const signer =
            provider.getSigner();


        const walletAddress =
            await signer.getAddress();

        console.log(
            "Connected wallet:",
            walletAddress
        );


        /* ================================================
           STEP 3 - CHECK NETWORK
        ================================================= */

        const network =
            await provider.getNetwork();

        console.log(
            "Network:",
            network
        );

        if (network.chainId !== 11155111) {

            alert(
                "Wrong network!\n\n" +
                "Please switch MetaMask to the Sepolia test network."
            );

            if (confirmButton) {
                confirmButton.disabled = false;
            }

            return;
        }


        /* ================================================
           STEP 4 - CONNECT SMART CONTRACT
        ================================================= */

        const contract =
            new ethers.Contract(
                contractAddress,
                contractABI,
                signer
            );

        console.log(
            "Contract:",
            contractAddress
        );


        /* ================================================
           STEP 5 - CONVERT CANDIDATE TO ID
        ================================================= */

        let candidateId = 0;

        if (
            selectedCandidate === "Candidate A" ||
            selectedCandidate === "1"
        ) {

            candidateId = 1;

        } else if (
            selectedCandidate === "Candidate B" ||
            selectedCandidate === "2"
        ) {

            candidateId = 2;

        } else if (
            selectedCandidate === "Candidate C" ||
            selectedCandidate === "3"
        ) {

            candidateId = 3;
        }


        if (candidateId === 0) {

            alert(
                "Invalid candidate selection."
            );

            if (confirmButton) {
                confirmButton.disabled = false;
            }

            return;
        }


        /* ================================================
           STEP 6 - ASK BACKEND FOR AUTHORIZATION
        ================================================= */

        console.log(
            "Requesting blockchain authorization..."
        );

        const authorizationResponse =
            await fetch(
               `${API_BASE_URL}/api/voters/${currentTestId}/authorize`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        candidateId: candidateId
                    })
                }
            );


        const authorization =
            await authorizationResponse.json();


        if (!authorizationResponse.ok) {

            alert(
                authorization.message ||
                "The backend could not authorize this vote."
            );

            if (confirmButton) {
                confirmButton.disabled = false;
            }

            return;
        }


        console.log(
            "Backend authorization received."
        );

        console.log(
            "Voter hash:",
            authorization.voterIdHash
        );


        /* ================================================
           STEP 7 - CHECK BLOCKCHAIN VOTING STATUS
        ================================================= */

        const alreadyVoted =
            await contract.hasVoted(
                authorization.voterIdHash
            );


        console.log(
            "Has this voter already voted on blockchain?",
            alreadyVoted
        );


        if (alreadyVoted) {

            alert(
                "This voter has already voted on the blockchain."
            );

            if (confirmButton) {
                confirmButton.disabled = false;
            }

            return;
        }


        /* ================================================
           STEP 8 - SIMULATE TRANSACTION
        ================================================= */

        try {

            await contract.callStatic.vote(
                authorization.voterIdHash,
                candidateId,
                authorization.signature
            );

        } catch (simulationError) {

            console.error(
                "Blockchain simulation failed:",
                simulationError
            );

            const reason =
                simulationError.reason ||
                simulationError.error?.reason ||
                "The smart contract rejected the vote.";

            alert(
                "Blockchain rejected the vote:\n\n" +
                reason
            );

            if (confirmButton) {
                confirmButton.disabled = false;
            }

            return;
        }


        /* ================================================
           STEP 9 - SEND BLOCKCHAIN TRANSACTION
        ================================================= */

        alert(
            "Your vote is ready.\n\n" +
            "Please confirm the transaction in MetaMask."
        );


        const tx =
            await contract.vote(
                authorization.voterIdHash,
                candidateId,
                authorization.signature
            );


        console.log(
            "Transaction submitted:",
            tx.hash
        );


        /* ================================================
           STEP 10 - WAIT FOR SEPOLIA
        ================================================= */

        await tx.wait();


        console.log(
            "Blockchain transaction confirmed:",
            tx.hash
        );


        /* ================================================
           STEP 11 - UPDATE MONGODB
        ================================================= */

        const response =
            await fetch(
               `${API_BASE_URL}/api/voters/${currentTestId}/vote`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        candidate: selectedCandidate
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            console.error(
                "MongoDB update failed:",
                data
            );

            alert(
                "IMPORTANT:\n\n" +
                "Your blockchain transaction succeeded, " +
                "but the database could not be updated.\n\n" +
                "Transaction:\n" +
                tx.hash
            );

            if (confirmButton) {
                confirmButton.disabled = false;
            }

            return;
        }


        /* ================================================
           STEP 12 - SHOW CONFIRMATION
        ================================================= */

        document.getElementById(
            "confirmationVoterId"
        ).textContent =
            currentTestId;


        document.getElementById(
            "confirmationCandidate"
        ).textContent =
            selectedCandidate;


        selectedCandidate = null;


        document
            .querySelectorAll(".candidate")
            .forEach(candidate => {

                candidate.classList.remove(
                    "selected"
                );

            });


        showSection(
            "confirmation-section"
        );


        alert(
            "SUCCESS!\n\n" +
            "Your vote has been recorded on the " +
            "Sepolia blockchain and saved in the " +
            "SecureVote database."
        );


    } catch (error) {

        console.error(
            "FULL VOTE ERROR:",
            error
        );


        let message =
            error.reason ||
            error.data?.message ||
            error.error?.message ||
            error.message ||
            "Unknown transaction error.";


        alert(
            "Vote transaction failed:\n\n" +
            message
        );


        if (confirmButton) {
            confirmButton.disabled = false;
        }
    }
}


/* =========================================================
   SHOW RESULTS
========================================================= */

async function showResults() {

    try {

        if (
            typeof ethers === "undefined"
        ) {

            console.error(
                "Ethers.js is not loaded."
            );

            return;
        }


        if (
            typeof window.ethereum === "undefined"
        ) {

            console.error(
                "MetaMask is not installed."
            );

            return;
        }


        const provider =
            new ethers.providers.Web3Provider(
                window.ethereum
            );


        const contract =
            new ethers.Contract(
                contractAddress,
                contractABI,
                provider
            );


        const results =
            await contract.getResults();


        const voteA =
            results.candidateA.toNumber();

        const voteB =
            results.candidateB.toNumber();

        const voteC =
            results.candidateC.toNumber();


        const votes = {

            "Candidate A": voteA,

            "Candidate B": voteB,

            "Candidate C": voteC
        };


        const totalVotes =
            voteA +
            voteB +
            voteC;


        const candidates = [
            "Candidate A",
            "Candidate B",
            "Candidate C"
        ];


        candidates.forEach(
            (candidate, index) => {

                const voteCount =
                    votes[candidate] || 0;


                let percentage = 0;


                if (totalVotes > 0) {

                    percentage =
                        (voteCount / totalVotes) * 100;
                }


                percentage =
                    Math.round(
                        percentage * 100
                    ) / 100;


                // Percentage
                const resultElement =
                    document.getElementById(
                        `result${index + 1}`
                    );


                if (resultElement) {

                    resultElement.textContent =
                        `${percentage}%`;
                }


                // Vote count
                const voteElement =
                    document.getElementById(
                        [
                            "votesA",
                            "votesB",
                            "votesC"
                        ][index]
                    );


                if (voteElement) {

                    voteElement.textContent =
                        `${voteCount} ${
                            voteCount === 1
                                ? "vote"
                                : "votes"
                        }`;
                }


                // Progress bar
                const barElement =
                    document.getElementById(
                        [
                            "barA",
                            "barB",
                            "barC"
                        ][index]
                    );


                if (barElement) {

                    barElement.style.width =
                        `${percentage}%`;
                }

            }
        );


        console.log(
            "Blockchain results:",
            votes
        );


    } catch (error) {

        console.error(
            "Could not read blockchain results:",
            error
        );

        alert(
            "Unable to load voting results from the blockchain."
        );
    }
}


/* =========================================================
   OPEN RESULTS
========================================================= */

function openResults() {

    showResults();

    showSection(
        "results-section"
    );
}


/* =========================================================
   RETURN HOME
========================================================= */

function returnHome() {

    currentTestId = null;

    currentVoter = null;

    selectedCandidate = null;


    const identityInput =
        document.getElementById(
            "identityInput"
        );


    if (identityInput) {

        identityInput.value = "";

        identityInput.type = "password";
    }


    const toggleButton =
        document.getElementById(
            "toggleIdButton"
        );


    if (toggleButton) {

        toggleButton.textContent =
            "Show";
    }


    const message =
        document.getElementById(
            "identityMessage"
        );


    if (message) {

        message.innerHTML = "";

        message.style.background =
            "transparent";
    }


    showSection(
        "home-section"
    );
}


/* =========================================================
   RESET DEMO DATA
========================================================= */

function resetDemoData() {

    localStorage.removeItem(
        "secureVoteResults"
    );

    alert(
        "Local demo data has been reset."
    );

    location.reload();
}


/* =========================================================
   PAGE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        showSection(
            "home-section"
        );

        showResults();
    }
);


/* =========================================================
   BACKEND CONNECTION TEST
========================================================= */

fetch(
    `${API_BASE_URL}/api/test`
)
    .then(
        response => response.json()
    )
    .then(
        data => {

            console.log(
                data.message
            );
        }
    )
    .catch(
        error => {

            console.error(
                "Backend connection failed:",
                error
            );
        }
    );