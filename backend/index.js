import { Server } from 'socket.io';

class Session {
    constructor(playerCreatingID, playerOneSocket) {
        this.playerOne = playerCreatingID;
        this.playerOneSocket = null;
        this.playerOneScore;
        this.playerTwo = null;
        this.playerTwoSocket = null;
        this.playerTwoScore;
        this.id = Math.random().toString(36).substr(-5).toUpperCase();
    }
    checkWin() {
        if (this.playerOneScore !== undefined && this.playerTwoScore !== undefined) {
            this.playerOneSocket.emit("game-over");
            this.playerTwoSocket.emit("game-over");
        }
    }
}

const io = new Server(3000, {
    cors: {
        origin: "https://bore2.gus.ink"
    }
});

let sessions = {};

io.on('connection', (socket) => {
    let currentSessionID;
    let isPlayerOne;

    socket.on("create", (user) => {
        let session = new Session(user, socket);    // Create a new session with the initiating user as player one
        session.playerOneSocket = socket;
        console.log("Starting session for user " + user, "-", session.id);
        sessions[session.id] = session;     // Store the session in the sessions dictionary, with the session id as its  
        currentSessionID = session.id;
        socket.emit("session-created", session.id);
        isPlayerOne = true;
    });
    socket.on("join", (user, sessionID) => {
        console.log("User " + user + " is joining session " + sessionID);
        currentSessionID = sessionID;
        if (sessions[sessionID] === undefined) {
            socket.emit("error", "Unknown Session ID");
            socket.disconnect();
        } else {
            sessions[sessionID].playerTwoSocket = socket;
            socket.emit("game-start");
            sessions[sessionID].playerOneSocket.emit("game-start");
        }
        isPlayerOne = false;
    });
    socket.on("player-one-prime", () => {
        sessions[currentSessionID].playerTwoSocket.emit("other-player-primed");
    })
    socket.on("player-two-prime", () => {
        sessions[currentSessionID].playerOneSocket.emit("other-player-primed");
    })
    socket.on("player-one-throw", (sessionID, score) => {
        sessions[sessionID].playerOneScore = score;
        sessions[sessionID].playerTwoSocket.emit("other-player-threw", score);
        sessions[sessionID].checkWin();
    });
    socket.on("player-two-throw", (sessionID, score) => {
        console.log("p2 throw", score)
        sessions[sessionID].playerTwoScore = score;
        sessions[sessionID].playerOneSocket.emit("other-player-threw", score);
        sessions[sessionID].checkWin();
    });
    socket.on("disconnect", () => {
        console.log("disconnect", currentSessionID)
        if (isPlayerOne && sessions[currentSessionID] && sessions[currentSessionID].playerTwoSocket) {
            sessions[currentSessionID].playerTwoSocket.emit("error", "Opponent has disconnected!");
            sessions[currentSessionID].playerTwoSocket.disconnect();
        } else if (sessions[currentSessionID] && sessions[currentSessionID].playerOneSocket) { 
            sessions[currentSessionID].playerOneSocket.emit("error", "Opponent has disconnected!");
            sessions[currentSessionID].playerOneSocket.disconnect();
        }
        delete sessions[currentSessionID];
    })
});