import {Server} from 'socket.io';

class Session {
    constructor(playerCreating, creatingSessionID) {
        this.playerOne = playerCreating;
        this.playerOneSocket = creatingSessionID;
        this.playerTwo = null;
        this.playerTwoSocket = null;
        this.playerOneScore = 0;
        this.playerTwoScore = 0;
        this.state = "waitingForPlayerTwo";
        this.id = Date.now().toString(36).substring(3).toUpperCase();
    }
    acceptSecondPlayer(player) {
        this.playerTwo = player;
        this.state = "playerOneTurn";
    }
    playerOneThrew(score) {
        this.playerOneScore = score;
        this.state = "playerTwoTurn";
    }
    playerTwoThrew(score) {
        this.playerTwoScore = score;
        this.state = "comparing";
        if (playerOneScore > playerTwoScore) {
            return "One";
        } else if (playerOneScore === playerTwoScore) {
            return "Tie";
        } else {
            return "Two";
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
});