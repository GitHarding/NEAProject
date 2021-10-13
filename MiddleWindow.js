let player1Score = 0;
let player2Score = 0;

//Use for updating the leaderboards - or upload to JSON file instead, accessed from anywhere
let storedValue = 0;//Temporary to test if I can locally save variables like scores
refreshBtn.addEventListener('click', () =>{
    storedValue = localStorage.getItem('testNo');
    storedValue ++;
    localStorage.setItem('testNo', testValue);
    document.getElementById('scoreP1').innerHTML = localStorage.getItem('testNo')

    if (confirm('Are you sure you want to refresh')) {
        alert("refreshed");
        //instead of refreshing every variable via tedious means Im going to locally store necessary values
        location.reload();                
    }else{

    }
})


function broadcastEnd(){
    //Acts to stop both multiplayer games if one has reached the end of the game
    //Needs to use the pause button
    //Needs to tally up results
    //Needs to declare a winner
    //Needs to send results to the leaderboard
}
function broadcastSabotage(){
    //Acts to sabotage a game window adding a layer of blocks when the other player clears x blocks in a row
    //Needs to check which player is sabotaging

}