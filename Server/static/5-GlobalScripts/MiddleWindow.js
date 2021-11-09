let paused = true;
let timerId;
const refreshBtn = document.querySelector('#refreshButton');
const startBtn = document.querySelector('#startButton');
let gameOver = false;

let pausedCountdown = 0;

let punishTick = 0;
let punishP1 = 0;
let punishP2 = 0;

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
    if(document.getElementById("ExportScoreP2").innerHTML == ("1Player")){//Shows its a 1 player game
        if(document.getElementById("ExportScoreP1").innerHTML == ("Player 2 Wins")){//Game Over function
            gamePause();
            alert("GAME OVER!")
            startBtn.disabled = true;
            gameOver = true;


            
            //let data = {name: "deez", score: 69};
            /*
            fetch('Scores.php', {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(data => {
                console.log('Success:', data);
                })
                .catch((error) => {
                console.error('Error:', error);
            });*/

            /*
            var formData = new FormData();
            formData.append("name", "bunga"); //Change these values soon __________________________________
            formData.append("name", 123456);   

            var request = new XMLHttpRequest();
            request.open("POST", "../Scores.php");
            request.send(formData); //<- where it all goes wrong
            */
            //COLLECT DATA AND SEND TO NODE_______________________________________________________________________________________
            var request = new XMLHttpRequest();
            request.open("POST", "/post");
            request.setRequestHeader("Content-Type", "application/json")
            request.send(JSON.stringify({name: "bunga", score: 954074305749854795846547936594667986})); //<- where it all goes wrong


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
    
    //Needs to send results to the leaderboard
}