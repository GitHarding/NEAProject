let paused = true;
let timerId;
const refreshBtn = document.querySelector('#refreshButton');
const startBtn = document.querySelector('#startButton');
let gameOver = false;

let pausedCountdown = 0;

let punishTick = 0;
let punishP1 = 0;
let punishP2 = 0;

let player1Score;
let player1Name;
let player2Score;
let player2Name;

let JSONString

//Use for updating the leaderboards - or upload to JSON file instead, accessed from anywhere
refreshBtn.addEventListener('click', () =>{
    if(confirm('Are you sure you want to refresh')) {  
        location.reload();                
    } 
});
    
    startBtn.addEventListener('click', () =>{    
        gamePause();
    })

    function gamePause(){
        if(paused == false){
            clearInterval(timerId);
            paused = true; //Pauses the game using this variable as you cannot directly check timerID for values
            startBtn.blur();//Deselects the button from the mouse
        }else{
            startBtn.disabled = false;
            clearInterval(timerId); //Needs to clear the interval otherwise there will be several individual calls at 500ms
            timerId = setInterval(broadcastAll, 500);
            startBtn.blur();//Deselects the button from the mouse
        }
    }
    
function broadcastAll(){
    if(!isNaN(document.getElementById("ExportScoreP1").innerHTML)){
        player1Score = parseInt(document.getElementById("ExportScoreP1").innerHTML)
    }
    if(!isNaN(document.getElementById("ExportScoreP1").innerHTML)){
        player2Score = parseInt(document.getElementById("ExportScoreP2").innerHTML)
    }

    if(document.getElementById("ExportScoreP2").innerHTML == ("1Player")){//Shows its a 1 player game
        if(document.getElementById("ExportScoreP1").innerHTML == ("Player 2 Wins")){//Game Over function - made exclusive to the 1PLR mode (Needing a different ending)
            gamePause();
            alert("GAME OVER!")
            startBtn.disabled = true;
            gameOver = true;

            player1Name = prompt("Please enter your name");
            //player1Score is calculated earlier as the same value is used to end the game

            //Retrieves the JSON and adds another value to the end
            fetch("../Scores.json") //Fetches the data
                .then(response => response.json())
                .then(data =>{
                    (JSONString = JSON.parse(JSON.stringify(data)));
                }).then(() => { //Then adds to the data string
                    JSONString.push({name: player1Name, score: player1Score}) //Uses the data just found for player 1
                    JSONString = JSON.stringify(JSONString)
                    sendJSONData(); //Sends the values to be sent and overwrite the file
                });
                
        }
        document.getElementById("ExportScoreP1").innerHTML = ("END")
    }else{
        if(document.getElementById("ExportScoreP1").innerHTML == ("Player 2 Wins")){//Game Over function
            gamePause();
            alert("GAME OVER AND PLAYER 2 WINS")
            startBtn.disabled = true;
            gameOver = true;
        }else if(document.getElementById("ExportScoreP2").innerHTML == ("Player 1 Wins")){
            gamePause();
            alert("GAME OVER AND PLAYER 1 WINS")
            startBtn.disabled = true;
            gameOver = true;
        }

        if(document.getElementById("ExportScoreP2").innerHTML == ("Player 1 Wins") || document.getElementById("ExportScoreP1").innerHTML == ("Player 2 Wins")){
            player1Name = prompt("Please enter your name");
            //player1Score is calculated earlier as the same value is used to end the game
            player1Name = prompt("Please enter your name");
            //player2Score is calculated earlier as the same value is used to end the game

            //Retrieves the JSON and adds another value to the end
            fetch("../Scores.json") //Fetches the data
                .then(response => response.json())
                .then(data =>{
                    (JSONString = JSON.parse(JSON.stringify(data)));
                }).then(() => { //Then adds to the data string
                    JSONString.push({name: player1Name, score: player1Score}) //Uses the data just found for player 1
                    SONString.push({name: player2Name, score: player2Score}) //Uses the data just found for player 1
                    JSONString = JSON.stringify(JSONString)
                    sendJSONData(); //Sends the values to be sent and overwrite the file
                });
        }

        if(paused == true){
            pausedCountdown ++;
            if(pausedCountdown > 3){
                paused = false; //Will play the game after 3*500ms countdown
                pausedCountdown = 0; //Resets the pausedcoundown variable
            }
        }else{

            if(punishTick < 30){
                punishTick ++;
            }else{
                punishTick = 0;
                if(document.getElementById("ExportScoreP1").innerHTML > document.getElementById("ExportScoreP2").innerHTML){
                    punishP2 += 10;
                    let Punish = Array.from(document.querySelectorAll('.gameGrid2 div'));
                    for(let i = punishP2;  i <  punishP2 + 10; i++){
                        Punish[i].style.backgroundColor = 'grey';
                        Punish[i].classList.add('block');
                        Punish[i].classList.add('filled');
                    }
                }else if(document.getElementById("ExportScoreP1").innerHTML < document.getElementById("ExportScoreP2").innerHTML){
                    punishP1 += 10;
                    let Punish = Array.from(document.querySelectorAll('.gameGrid div'));
                    for(let i = punishP1;  i <  punishP1 + 10; i++){
                        Punish[i].style.backgroundColor = 'grey';
                        Punish[i].classList.add('block');
                        Punish[i].classList.add('filled');
                    }
                }
            }
        }
    }

    async function sendJSONData(){
        //Makes formdata here
        const data = new FormData();
        data.append("scores", JSONString); //(The object, The Details)

        //Sends a data POST request
        const response = await fetch("/send",{method: "POST", body: data});
        const message = await response.text();
        console.log(message) //Sends a message back (Used entirely for debugging purposes)

    }
}