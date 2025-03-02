import {Server} from 'socket.io';

class Session {
    constructor(playerCreating) {
        this.playerOne = playerCreating;
        this.playerTwo = null;
        this.playerOneScore = 0;
        this.playerTwoScore = 0;
        this.state = "waitingForPlayerTwo";
        this.id = Date.now().toString(36).substring(2);
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

const io = new Server(3000);

let sessions = {};

io.on('connection', (socket) => {
    socket.emit("Hi client!");
    socket.on("Create", (user) => {
        console.log("Starting session for user " + user);
        let session = new Session(user);    // Create a new session with the initiating user as player one
        sessions[session.id] = session;     // Store the session in the sessions dictionary, with the session id as its  
    });
});