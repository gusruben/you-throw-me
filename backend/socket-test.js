import {Server} from 'socket.io';

class Session {
    constructor(playerCreating) {
        this.playerOne = playerCreating;
        this.playerTwo = null;
        this.playerOneScore = 0;
        this.playerTwoScore = 0;
        this.state = "waitingForPlayerTwo";
        this.id = Math.random().toString(36).substring(2);
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

io.on('connection', (socket) => {
    socket.emit("hello", "world");
    socket.on("howdy", (msg) => {
        console.log(msg);
    });
});