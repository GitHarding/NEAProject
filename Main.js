document.addEventListener('DOMContentLoaded', () => {


//Initialises The DIV grid in the CSS
let applyHTML = document.createDocumentFragment();
let applyHTMLP = document.createDocumentFragment();

//Game Blocks
for(let i = 0; i < 200; i++){//Creates 200 squares to fill the game grid
    let divGen = document.createElement('div');
    applyHTML.appendChild(divGen);
}

//Game Border
for(let i = 0; i < 10; i++){//Creates 10 squares to fill the bottom border of the game grid
    divGen = document.createElement('div');
    divGen.className = 'filled';
    applyHTML.appendChild(divGen);
}

//Game Preview Box
    for(let i = 0; i < 9; i++){//Creates 9 squares to fill the preview square
        divGen = document.createElement('div');
        applyHTMLP.appendChild(divGen);
    }

//Applies all of the HTML elements in the 2 statements below
document.getElementsByClassName("gameGrid")[0].appendChild(applyHTML);
document.getElementsByClassName("preview")[0].appendChild(applyHTMLP);







    //Finds all the html components
    const startBtn = document.querySelector('#startButton');
    const ScoreDisplay = document.querySelector('#score');
    const grid = document.querySelector('.gameGrid');

    //Creates and uses the squares
    let squares = Array.from(document.querySelectorAll('.gameGrid div'));
    const width = 10;

    //Timer based variables
    let timerId;
    let paused = true;


    //Block variables
    const testBlock = [
        //[0,1+width, 2+width*2] How the basic grid system works
        [1+width,1+width*2,2], //Stores each rotation of the same block shape
        [width, 1+width, 2+width*2],
        [1,width+1, width*2],
        [0,1+width, 2+width]
    ]

    const Blocks = [testBlock]; //Blocks are stored in 1 larger array
    let random = 0; //Random selection of blocks

    let currentPosition = 0; //Position of the centre of the block on the board
    let currentRotation = 0; //the current rotation of the block
    let current = Blocks[0][0]; //Stores the current block and the current rotation
    let nextRandom = 0; //Stores the next random block ahead of time



    function blockDraw() {
        current.forEach(index => { //For each block it will fill the relevant square based on position
            squares[currentPosition + index].classList.add('block');
        })
    }

    function blockErase(){ //Removes all instances of the block, similar to a canvas clearing
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('block');
        })
    }

    //Timer functionality
    function moveDown(){
        blockCheck(); //Checks the block at the end of the cycle - could be moved to before the cycle to create a sliding effect?
        blockErase(); //Erases the block from the "canvas"
        currentPosition += width; //Adds 10 to the value to "drop" the block downward
        blockDraw(); //Redraws the block afterwards
    }

    //Block collision checking functionality
    function blockCheck(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('filled'))){
            current.forEach(index => squares[currentPosition + index].classList.add('filled')); //Make the block currently being controlled act as a filler block and stick
            random = nextRandom; //Starts to instantiate a new Block
            currentRotation = 0;
            nextRandom = Math.floor(Math.random() * Blocks.length);
            current = Blocks[0][0]; //Doesnt yet use randomisation as there is only 1 block
            currentPosition = 4;//183;
            blockDraw(); //Draws the new instantiated block
            displayShape(); //Displays the new shape
            gameOver(); //Checks for a game over
        }
    }

    //Input dedicated functions
    document.addEventListener('keydown', control); //Adds the event listener for keyboards
    let lastPressed = 0;//Used to stop mass key presses when a key is held down
    let now; //Used to determine the last time a key was touched
    let lastKeyCode = 0; //Used to determine if the last key pressed was a repeat of the last key
    function control(key) {

        now = Date.now();
        if(now - lastPressed < 100 && lastKeyCode == key.keyCode) return;//Stops any key pressing if it is mass used
        lastPressed = now
        lastKeyCode = key.keyCode

        if(!paused){ //User can use the control keys on keyboards if the game is un-paused
            if(key.keyCode === 37){ //If the left arrow is pressed
                moveLeft();
            } else if(key.keyCode === 38){ //If the up arrow is pressed
                blockCheck(); //Checks the blocks before it rotates
                blockRotate(); //Then rotates the block
            } else if(key.keyCode === 39){ //If the right arrow is pressed
                moveRight();
            } else if(key.keyCode === 40){ //If the down arrow is pressed
                moveDown() //Fast drops the block
            }
        }
    }


    function moveLeft(){ //Moves the block left by changing the centre
        blockErase();
        const leftEdge = current.some(index => (currentPosition + index) % width === 0); //If the block is at the left edge it is set to true

        if(!leftEdge){ //If the block is not on the left edge it can move left
            currentPosition -=1;
        }
        if(current.some(index => squares[currentPosition + index].classList.contains('filled'))){
            currentPosition +=1;
        }
        blockDraw();
    }

    function moveRight(){
        blockErase();
        const rightEdge = current.some(index => (currentPosition + index) % width === width-1);
        if(!rightEdge){
            currentPosition +=1;
        }
        if(current.some(index => squares[currentPosition + index].classList.contains('filled'))){
            currentPosition -=1;
        }
        blockDraw();
    }

    function blockRotate() {
        let lodgedLeft = false;
        let lodgedRight = false;
        //squares[currentPosition + 2].classList.add('block')

        if(current.some(element => squares[currentPosition + 2].classList.contains('filled')) || current.some(element => squares[currentPosition + width + 2].classList.contains('filled')) || current.some(element => squares[currentPosition + 2 - width].classList.contains('filled'))){ //Checks for block lodging
            lodgedRight = true;
        }
        if(current.some(element => squares[currentPosition].classList.contains('filled')) || current.some(element => squares[currentPosition + width].classList.contains('filled')) || current.some(element => squares[currentPosition - width].classList.contains('filled'))){ //Checks for block lodging
            lodgedLeft = true;
        }

        if(lodgedLeft && lodgedRight) {//Will not rotate if the block is stuck within a small 2 wide space
        }else{
            blockErase();
            if(currentPosition % 10 == 9 || lodgedLeft){ //Checks if the centre block is on the edges as it can wrap to the other side
                currentPosition +=1; //Will move the centre right before rotating
            }else if(currentPosition % 10 == 8  || lodgedRight){
                currentPosition -= 1; //Will move the centre left before rotating
            }
            currentRotation ++; //Iterates to the next rotation of block
            if(currentRotation === current.length+1){
                currentRotation = 0;
            }
            current = Blocks[random][currentRotation];
            blockDraw();
        }
    }


    //Show preview squares
    const displaySquares = document.querySelectorAll('.preview div');
    const displayWidth = 3; //Gives the width of the Divs
    let displayIndex = 0;

    const nextBlock = [
        //Blocks[0]
        [1+displayWidth,1+displayWidth*2,2] //There is only currently 1 block in the array but more are intended
    ];

    function displayShape(){
        displaySquares.forEach(square => {
            square.classList.remove('block') //Clears the preview grid
        })
        nextBlock[nextRandom].forEach(index => { //Adds the next shape to the preview grid
            displaySquares[displayIndex + index].classList.add('block');
        })
    }

    startBtn.addEventListener('click', () =>{
        if(paused == false){
            alert("Paused");
            clearInterval(timerId);
            paused = true;
        }else{
            alert("Play");
            blockDraw();
            timerId = setInterval(moveDown, 200);
            paused = false;
            nextRandom = Math.floor(Math.random()*Blocks.length);
            displayShape();
        }
    })

    function gameOver() { //Game Over Functionality
        if(current.some(index => squares[currentPosition + index].classList.contains('filled'))){
            ScoreDisplay.innerHTML = 'end'; //Used to temporarily display to the player that the game is over
            clearInterval(timerId); //Stops the incrementing timer that plays the game
            paused = true; //Pauses the game
        }

    }
})