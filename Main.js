document.addEventListener('DOMContentLoaded', () => {

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
        console.log(currentPosition);
        blockErase(); //Erases the block from the "canvas"
        currentPosition += width; //Adds 10 to the value to "drop" the block downward
        blockDraw(); //Redraws the block afterwards
        blockCheck(); //Checks the block at the end of the cycle - could be moved to before the cycle to create a sliding effect?
    }

    //Block collision checking functionality
    function blockCheck(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('filled'))){
            current.forEach(index => squares[currentPosition + index].classList.add('filled')); //Make the block currently being controlled act as a filler block and stick
            random = nextRandom; //Starts to instantiate a new Block
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
    function control(key) {
        if(!paused){ //User can use the control keys on keyboards if the game is unpaused
            if(key.keyCode === 37){
                moveLeft();
            } else if(key.keyCode === 38){
                blockRotate();
            } else if(key.keyCode === 39){
                moveRight();
            } else if(key.keyCode === 40){
                //fast drop - yet to be implemented
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
        blockErase();
        if(currentPosition % 10 == 9){ //Checks if the centre block is on the edges as it can wrap to the other side
            currentPosition +=1; //Will move the centre right before rotating
        }else if(currentPosition % 10 == 8){
            currentPosition -= 1; //Will move the centre left before rotating
        }
        currentRotation ++; //Iterates to the next rotation of block
        if(currentRotation === current.length+1){
            currentRotation = 0;
        }
        current = Blocks[random][currentRotation];
        blockDraw();
    }


    //Show preview squares
    const displaySquares = document.querySelectorAll('.preview div');
    const displayWidth = 3;
    let displayIndex = 0;

    const nextBlock = [
        //Blocks[0]
        [1+displayWidth,1+displayWidth*2,2]
    ];

    function displayShape(){
        displaySquares.forEach(square => {
            square.classList.remove('block')
        })
        nextBlock[nextRandom].forEach(index => {
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

    function gameOver() { //Unsure if game over currently works so it has been disabled for later development
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            //scoreDisplay.innerHTML = 'end';
            //clearInterval(timerId);
            //paused = true;
            alert("uh oh");
        }
    }
})