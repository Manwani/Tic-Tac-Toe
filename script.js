//gameboardModule
var gameBoard = (() => {

    var grid = document.querySelector(".board");   
    var message = document.querySelector(".message"); 
    var restartButton = document.querySelector(".restart");
    restartButton.addEventListener("click", restartGame);

    function createBoard() {
        for(var i = 1; i < 10; i++){
        var holder = document.createElement("div");
        holder.className = i;
        holder = assignListeners(holder);
        grid.appendChild(holder);
        }
    }

    function assignListeners(hold){

        hold.addEventListener("click", gameController.gameLoop);

        hold.addEventListener("mouseover", () => {
            hold.style.backgroundColor = "#e0cb96";
        });


        hold.addEventListener("mouseout", () => {
            hold.style.backgroundColor = "#F8E2A8";
        });

        return hold;
    }

    function setMessage(text){
        message.innerText = text;
    }

    function noNewMoves(){
        for(let i = 0; i < grid.children.length; i++){
            grid.children[i].removeEventListener("click", gameController.gameLoop);
        }
    }

    function restartGame(){
        firstPlayer.resetPlayerPos();
        secondPlayer.resetPlayerPos();
        destroyBoard(grid);
        createBoard();
        setMessage("Player " + firstPlayer.name + "'s Turn");
        gameController.resetVariables();
    }

    function destroyBoard(parent){
        while(parent.firstChild){
            parent.removeChild(parent.firstChild);
        }

    }
    

    return{
        createBoard,
        setMessage,
        noNewMoves,
     };
    



})();
//player factory
var player = (name, mark) => {
   
    var playerPos = [];

    function resetPlayerPos(){
        this.playerPos = [];
    }

    return{
        name,
        mark,
        playerPos,
        resetPlayerPos
    };

};
//game module
var gameController = (() =>{
    var playerTurn = 0;
    var gameWon = false;

    var gameWinCon = [
        ["1" , "2", "3"],
        ["4" , "5", "6"],
        ["7" , "8", "9"],
        ["1" , "4", "7"],
        ["2" , "5", "8"],
        ["3" , "6", "9"],
        ["1" , "5", "9"],
        ["3" , "5", "7"],
    ];

    function gameLoop(e){
        if(gameController.checkValidSpaces(e)){
                if(gameController.whosTurn() === 0){ //first players turn
                    gameBoard.setMessage("Player " + secondPlayer.name + "'s Turn");
                    gameController.markSpot(firstPlayer, e);
                    if(gameController.checkPlayerCounter() > 4){
                        gameController.checkForWinner(firstPlayer);
                    }
                }
                else{ //second players turn
                    gameBoard.setMessage("Player " + firstPlayer.name + "'s Turn");
                    gameController.markSpot(secondPlayer, e);
                    if(gameController.checkPlayerCounter() > 4){
                        gameController.checkForWinner(secondPlayer);
                    }
                } 
                //check for draw
                if(!gameController.movesAvailable() && !gameController.checkGameWon()){
                    gameBoard.setMessage("IT'S A DRAW");
                }
        }
    }

    function whosTurn(){
        if((playerTurn % 2) === 0){
            incrementPlayerCounter();
            return 0;
        }
        else{
            incrementPlayerCounter();
            return 1;
        }
    }

    function incrementPlayerCounter(){
         playerTurn++;
    }

    function checkPlayerCounter(){
        return playerTurn;
    }

    function checkGameWon(){
        return gameWon;
    }

    function movesAvailable(){
        if(playerTurn < 9){
            return true;
        }
        return false;
    }
    //make sure a space isnt taken by any other player 
    function checkValidSpaces(e){
        if(!firstPlayer.playerPos.includes(e.path[0].className) && !secondPlayer.playerPos.includes(e.path[0].className)){
            return true;
        }
        return false;
    }
    //place position marked to player array and also upload their mark to div
    function markSpot(player, e){
        player.playerPos.push(e.path[0].className);
        var div = document.getElementsByClassName(e.path[0].className);
        var img = document.createElement("img");
        if(player.mark === "x"){
            img.src = "x.png";
        }
        else{
            img.src = "o.png";
        }
        //prevent the game loop click event from firing from clicking image
        img.addEventListener("click", (e) => {
            e.stopPropagation();
        });
        div[0].appendChild(img);
    }

    function checkForWinner(player){
        var isWinner = false;
        for(let i = 0; i < gameWinCon.length; i++){
            var winCon = gameWinCon[i];
            isWinner = winCon.every((currentValue) => player.playerPos.includes(currentValue));
            if(isWinner){
                gameWon = true;
                gameEnd(player);
                break;
            }
        }
    }

    function gameEnd(player){
        gameBoard.setMessage("Player " + player.name + " Has Won The Game");
        gameBoard.noNewMoves();     
    }

    function resetVariables(){
        playerTurn = 0;
        gameWon = false;
    }

    return{
        gameLoop,
        whosTurn,
        checkPlayerCounter,
        movesAvailable,
        checkValidSpaces,
        markSpot,
        checkForWinner,
        checkGameWon,
        gameEnd,
        resetVariables
    };

})();

gameBoard.createBoard();
var firstPlayer = player("X", "x");
var secondPlayer = player("O", "o");








