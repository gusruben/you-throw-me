import {Server} from 'socket.io';

class Session {
    constructor(playerCreating, creatingSessionID) {
        this.playerOne = playerCreating;
        this.playerOneSocket = creatingSessionID;
        this.playerOneScore;
        this.playerTwo = null;
        this.playerTwoSocket = null;
        this.playerTwoScore;
        this.id = Date.now().toString(36).substring(3).toUpperCase();
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
    let sessionID;

    socket.emit("Hi client!");
    socket.on("create", (user) => {
        console.log("Starting session for user " + user);
        let session = new Session(user);    // Create a new session with the initiating user as player one
        sessions[session.id] = session;     // Store the session in the sessions dictionary, with the session id as its  
        sessionID = session;
        socket.emit("session-created", session.id);  
    });
    socket.on("join", (sessionID, user) => {
        console.log("User " + user + " is joining session " + sessionID);
        if (sessions[sessionID] === undefined) {
            socket.emit("error", "Unknown Session ID");
        } else {
            sessions[sessionID].secondPlayer = user;
            socket.emit("game-start");
            sessions[sessionID].playerOneSocket.emit("game-start");
        }
    });
    socket.on("player-one-throw", (sessionID, score) => {
        sessions[sessionID].playerOneScore = score;
        sessions[sessionID].playerTwoSocket.emit("other-player-threw", score);
        checkWin();
    });
    socket.on("player-two-throw", (sessionID, score) => {
        sessions[sessionID].playerTwoScore = score;
        sessions[sessionID].playerOneSocket.emit("other-player-threw", score);
        checkWin();
    });
});