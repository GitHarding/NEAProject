document.addEventListener('DOMContentLoaded', () => {
    "use strict";
     
    //Initialises The DIV grid in the CSS
    let applyHTML = document.createDocumentFragment();
    let applyHTMLP = document.createDocumentFragment();
     
     
    //Game Border
    for(let i = 0; i < 10; i++){//Creates 10 squares to fill the top border of the game grid
        
        let divGen = document.createElement('div');
     
        /*if(i %2 == 0){
            divGen.style.marginTop = '-10px'
        }*/
     
        divGen.style.backgroundColor = 'black';
        divGen.className = 'filled';
        applyHTML.appendChild(divGen);
    }
     
    //Game Blocks
    for(let i = 0; i < 200; i++){//Creates 200 squares to fill the game grid
        let divGen = document.createElement('div');
        /*if(i %2 == 0){ //Makes the hexagon grid (CANCELLED)
            divGen.style.marginTop = '-10px'
        }*/
        applyHTML.appendChild(divGen);
    }
     
    //Game Preview Box
        for(let i = 0; i < 9; i++){//Creates 9 squares to fill the preview square
            let divGen = document.createElement('div');
            /*if(i %2 == 0){ //Makes the hexagon grid (CANCELLED)
                divGen.style.marginTop = '-10px'
            }*/
            applyHTMLP.appendChild(divGen);
        }
     
    //Applies all of the HTML elements in the 2 statements below
    document.getElementsByClassName("gameGrid")[0].appendChild(applyHTML);
    document.getElementsByClassName("preview")[0].appendChild(applyHTMLP);
     
        //Finds all the html components
        const startBtn = document.querySelector('#startButton');
        const refreshBtn = document.querySelector('#refreshButton');
        const ScoreDisplay = document.querySelector('#score');
        const grid = document.querySelector('.gameGrid');
     
        //Creates and uses the squares
        let squares = Array.from(document.querySelectorAll('.gameGrid div'));
        const width = 10;
     
        //Timer based variables
        let timerId;
        let paused = true; //Used to check if a pause is occuring
     
    //HTML INITIALISATION_________________________________________________________________________________________________
     
        //Block variables
        const solidBlock = [ //check why this doesnt work, completely unsure_________________________________________________________________________________________________
            [0, 1, 2, 10, 11, 12, 20, 21, 22],
            [0, 1, 2, 10, 11, 12, 20, 21, 22],
            [0, 1, 2, 10, 11, 12, 20, 21, 22],
            [0, 1, 2, 10, 11, 12, 20, 21, 22]
        ]
        const aBlock = [ //Half L Block
            [1+width,1+width*2,2], //Stores each rotation of the same block shape
            [width, 1+width, 2+width*2],
            [1,width+1, width*2],
            [0,1+width, 2+width]
        ]
        const bBlock = [ //Nugget Block
            [1, 1+width, 2+width], //Stores each rotation of the same block shape
            [1+width, 1+width*2, 2+width],
            [width, 1+width, 1+width*2],
            [width, 1, 1+width]
        ]
        const cBlock = [//V Block
            [0, 1+width, 2], //Stores each rotation of the same block shape
            [2, 1+width, 2+width*2],
            [width*2, 1+width, 2+width*2],
            [0, 1+width, width*2]
        ]
        const dBlock = [ // "/" Block
            [0, 1+width, 2+width*2], //Stores each rotation of the same block shape
            [2, 1+width, width*2],
            [2+width*2, 1+width, 0],
            [width*2, 1+width, 2]
        ]
        const eBlock = [
            [1, 1+width, 1+width*2], //Stores each rotation of the same block shape
            [width, 1+width, 2+width],
            [1, 1+width, 1+width*2],
            [2+width, 1+width, width]
        ]
        /*const fBlock = [ //FIGURE OUT WHY THIS DOESNT WORK
            [1, 1+width, 1+width*2, 2+width*2], //Stores each rotation of the same block shape
            [width, width*2, 1+width, 2+width],
            [0, 1, 1+width, 1+width*2],
            [width, 1+width, 2+width, 2]
        ]*/
        
        let Blocks = [aBlock]//, bBlock, cBlock, dBlock, eBlock];//Blocks are stored in 1 larger array - make sure this works because it doesnt look like it does
        let nextBlocks = [bBlock];
        let blockColour = [ //Defaulted to red to prevent null values
            ['green'],['green'],['green'],
            ['green'],['green'],['green'],
            ['green'],['green'],['green']
        ]
        let nextBlockColour = [
            ['red'],['red'],['red'],
            ['red'],['red'],['red'],
            ['red'],['red'],['red'] 
        ]
        const availableColours = [
            //['red']//for testing matches
            ['yellow'], ['red'], ['purple'], ['green']
        ]
     
        
        let random = 0; //Random selection of blocks
     
        let currentPosition = 183; //Position of the centre of the block on the board
        let currentRotation// = 0; //the current rotation of the block
        let current = Blocks[0][0]; //Stores the current block and the current rotation
        //let nextRandom = 0; //Stores the next random block ahead of time
     
        let leftEdge = current.some(index => (currentPosition + index) % width === 0); //If the block is at the left edge it is set to true
        let rightEdge = current.some(index => (currentPosition + index) % width === width-1);
     
        let initialising = true;
     
    //BLOCK/GAME INITIALISATION_________________________________________________________________________________________________
        if(initialising == true){
            instantiateBlock();
        }
        
        function instantiateBlock(){
            if(initialising == true){
                /*initialising = false;
                for(let i=0;i < blockColour.length; i++){
                    blockColour[i] = availableColours[Math.floor(Math.random() * availableColours.length)]
                }*/
            }
            
            currentRotation = 0;
            currentPosition = 183;
            Blocks = nextBlocks;
            current = Blocks[0][0];
            blockColour = nextBlockColour
        
                switch(Math.floor(Math.random() * 5)){
                case 1:
                    nextBlocks = [aBlock];
                    break;
                case 2:
                    nextBlocks = [bBlock];
                    break;
                case 3:
                    nextBlocks = [cBlock];
                    break;
                case 4:
                    nextBlocks = [dBlock];
                    break;
                case 5:
                    nextBlocks = [eBlock];
                    break;
                }
                for(let i=0;i < blockColour.length; i++){
                    nextBlockColour[i] = availableColours[Math.floor(Math.random() * availableColours.length)]            
                }
            
        }
     
        function blockDraw() {
            current.forEach(index => { //For each block it will fill the relevant square based on position
                squares[currentPosition + index].classList.add('block');
     
                if(index >= 20){ //Offsets by 14 as thats the next colour down in position
                    squares[currentPosition + index].style.backgroundColor = blockColour[index - 14];
                }else if(index >= 10){ //Offsets by 7 as thats the next colour down in position
                    squares[currentPosition + index].style.backgroundColor = blockColour[index - 7];
                }else{
                    squares[currentPosition + index].style.backgroundColor = blockColour[index];
                }
            })
        }
     
        function blockErase(){ //Removes all instances of the block, similar to a canvas clearing
            current.forEach(index => {
                squares[currentPosition + index].classList.remove('block');
                squares[currentPosition + index].style.removeProperty("background-color");
            })
        }
     
        //Timer functionality
        function moveUp(){
            leftEdge = current.some(index => (currentPosition + index) % width === 0); //If the block is at the left edge it is set to true
            rightEdge = current.some(index => (currentPosition + index) % width === width-1);
            blockCheck(false); //Checks the block at the end of the cycle - could be moved to before the cycle to create a sliding effect?
            blockErase(); //Erases the block from the "canvas"
            currentPosition -= width; //Adds 10 to the value to raise the block downward
            blockDraw(); //Redraws the block afterwards
        }
        
     
     
        function flashUp(){
            let flashable = true //Checks if a flash block can occur
            let flashDistance = 0; //Checks the distance of a flash drop for it to happen
            while(flashable == true){
                if(!current.some(index => squares[currentPosition + index - width - flashDistance].classList.contains('filled'))){
                    flashDistance += width;
     
                }else{
                    blockErase(); //Erases the block from the "canvas"
                    currentPosition -= flashDistance; //Adds 10 to the value to raise the block downward
                    blockDraw(); //Redraws the block afterwards
                    blockCheck();
                    flashable = false;
                }
            }
            
        }
     
        //Block collision checking functionality
        function blockCheck(unconditional){
            let blocksToClear = []; //Takes all the blocks to clear, saves for later use
            
            if(current.some(index => squares[currentPosition + index - width].classList.contains('filled')) || unconditional){
                current.forEach(index => squares[currentPosition + index].classList.add('filled')); //Make the block currently being controlled act as a filler block and stick
                current.forEach(index => { //For each block newly placed it will reiterate <- this works fine
                    //let newblock = squares[currentPosition + index]; //Do i even need this?
     
                    let matchingBlocks = []; //Creates an array of all the blocks that need to be destroyed, also being used to keep the flower search iterating
                    let arrayIndex = 0; //Used to iterate the while loop for the flower search
                    matchingBlocks.push(currentPosition + index) //Puts the current selected block into the flower search array to start the search
     
                    while(arrayIndex < matchingBlocks.length){
     
                        if(squares[matchingBlocks[arrayIndex]].style.backgroundColor === squares[(matchingBlocks[arrayIndex]) + 1].style.backgroundColor && !(matchingBlocks.includes(matchingBlocks[arrayIndex] + 1) && (arrayIndex % 10 !=9))){
                            matchingBlocks.push(matchingBlocks[arrayIndex] + 1); //If the block is to the right it adds it to the flowering array
                            console.log("here")
                        }
                        if(squares[matchingBlocks[arrayIndex]].style.backgroundColor === squares[(matchingBlocks[arrayIndex]) - 1].style.backgroundColor && !(matchingBlocks.includes(matchingBlocks[arrayIndex] - 1)) && (arrayIndex % 10 !=1)){
                            matchingBlocks.push(matchingBlocks[arrayIndex] - 1); //If the block is to the left it adds it to the flowering array
                            console.log("there")
                        }
                        if(squares[matchingBlocks[arrayIndex]].style.backgroundColor === squares[(matchingBlocks[arrayIndex]) + width].style.backgroundColor && !(matchingBlocks.includes(matchingBlocks[arrayIndex] + width))){
                            matchingBlocks.push(matchingBlocks[arrayIndex] + width); //If the block is above it adds it to the flowering array
                        }
                        if(squares[matchingBlocks[arrayIndex]].style.backgroundColor === squares[(matchingBlocks[arrayIndex]) - width].style.backgroundColor && !(matchingBlocks.includes(matchingBlocks[arrayIndex] - width))){
                            matchingBlocks.push(matchingBlocks[arrayIndex] - width); //If the block is below it adds it to the flowering array
                        }
                        arrayIndex++; //Iterates the loop
                        
                    }
                    //console.log(matchingBlocks);
                    if(arrayIndex >= 5){
                        for(let i = matchingBlocks.length - 1; i > -1; i--){//afterwards clears them
                            blocksToClear.push(matchingBlocks[i]); //Pushes all the blocks to an outside array, it cannot clear the blocks within the "newly placed blocks" as it potentially clears unchecked blocks
                        }
                    }
     
                    matchingBlocks = []; //Resets matching blocks to check for the next block
                });
     
                //New block instantiating
                instantiateBlock();
                blockDraw(); //Draws the new instantiated block
                displayShape(); //Displays the new shape
                gameOver(); //Checks for a game over
                
            }
            //Clears all of the blocks
            for(let i = blocksToClear.length - 1; i> -1; i--){
                squares[blocksToClear[i]].classList.remove('block'); //Removes all the required classes and colours
                squares[blocksToClear[i]].classList.remove('filled');
                squares[blocksToClear[i]].style.removeProperty("background-color");
            }
            //Gravity
     
            let gravityCheck = []; //Checks for blocks affected by gravity
            let gravityAffect = []; //Takes the blocks that are able to be affected by gravity
     
            //for loop using the sides (10,20 etc and  19,29,39+ bottom 10,11,12,13,14,15,16,17,18,19,20)
            for(let i = 10; i < 20; i++){
                if(squares[i].classList.contains('block')){
                    gravityCheck.push(i);
                }
            }
            
            let arrayGIndex = 0;
            while(arrayGIndex < gravityCheck.length){
                //console.log(gravityCheck.length)
                if(squares[(gravityCheck[arrayGIndex]) + 1]){
                    if(squares[(gravityCheck[arrayGIndex]) + 1].style.backgroundColor && !(gravityCheck.includes(gravityCheck[arrayGIndex] + 1))){
                        gravityCheck.push(gravityCheck[arrayGIndex] + 1); //If the block is to the right it adds it to the flowering array
                    }
                }
                if(squares[(gravityCheck[arrayGIndex]) - 1]){
                    if(squares[(gravityCheck[arrayGIndex]) - 1].style.backgroundColor && !(gravityCheck.includes(gravityCheck[arrayGIndex] - 1))){
                        gravityCheck.push(gravityCheck[arrayGIndex] - 1); //If the block is to the left it adds it to the flowering array
                    }
                }
                if(squares[(gravityCheck[arrayGIndex]) + width]){
                    if(squares[(gravityCheck[arrayGIndex]) + width].style.backgroundColor && !(gravityCheck.includes(gravityCheck[arrayGIndex] + width))){
                        gravityCheck.push(gravityCheck[arrayGIndex] + width); //If the block is above it adds it to the flowering array
                    }
                }
                if(squares[(gravityCheck[arrayGIndex]) - width]){
                    if(squares[(gravityCheck[arrayGIndex]) - width].style.backgroundColor && !(gravityCheck.includes(gravityCheck[arrayGIndex] - width)) && (gravityCheck[arrayGIndex] - width) > 10){
                        gravityCheck.push(gravityCheck[arrayGIndex] - width); //If the block is below it adds it to the flowering array
                    }
                }
                if(squares[(gravityCheck[arrayGIndex]) + width + 1]){
                    if(squares[(gravityCheck[arrayGIndex]) + width + 1].style.backgroundColor && !(gravityCheck.includes(gravityCheck[arrayGIndex] + width + 1))){
                        gravityCheck.push(gravityCheck[arrayGIndex] + width + 1); //If the block is above it adds it to the flowering array
                    }
                }
                if(squares[(gravityCheck[arrayGIndex]) + width - 1]){
                    if(squares[(gravityCheck[arrayGIndex]) + width - 1].style.backgroundColor && !(gravityCheck.includes(gravityCheck[arrayGIndex] + width - 1))){
                        gravityCheck.push(gravityCheck[arrayGIndex] + width - 1); //If the block is below it adds it to the flowering array
                    }
                }
                if(squares[(gravityCheck[arrayGIndex]) - width + 1]){
                    if(squares[(gravityCheck[arrayGIndex]) - width + 1].style.backgroundColor && !(gravityCheck.includes(gravityCheck[arrayGIndex] - width + 1))&& (gravityCheck[arrayGIndex] - width) >= 10){
                        gravityCheck.push(gravityCheck[arrayGIndex] - width + 1); //If the block is above it adds it to the flowering array
                    }
                }
                if(squares[(gravityCheck[arrayGIndex]) - width - 1]){
                    if(squares[(gravityCheck[arrayGIndex]) - width - 1].style.backgroundColor && !(gravityCheck.includes(gravityCheck[arrayGIndex] - width - 1)) && (gravityCheck[arrayGIndex] - width) >= 10){
                        gravityCheck.push(gravityCheck[arrayGIndex] - width - 1); //If the block is below it adds it to the flowering array
                    }
                }
                arrayGIndex++; //Iterates the loop
                
            }
     
            for(let i = squares.length - 1; i > -1; i--){
                if(!gravityCheck.includes(i)){
                    if(squares[i].style.backgroundColor && squares[i].style.backgroundColor != "black"){
                        gravityAffect.push(i)
                    }
                }
            }
     
            for(let i = gravityAffect.length - 1; i > -1; i--){
                squares[gravityAffect[i]].style.backgroundColor = "transparent"
                squares[gravityAffect[i]].classList.remove('block');
                squares[gravityAffect[i]].classList.remove('filled')
                //console.log(squares[gravityCheck[i]].backgroundColor)
                //blocks that are affected is gravityAffect.length - current.length i think
            }
            
            blocksToClear = [];
            gravityCheck = [];
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
                } else if(key.keyCode === 40){ //If the down arrow is pressed
                    blockCheck(false); //Checks the blocks before it rotates
                    blockRotate(); //Then rotates the block
                } else if(key.keyCode === 39){ //If the right arrow is pressed
                    moveRight();
                } else if(key.keyCode === 38){ //If the up arrow is pressed
                    moveUp(); //Fast drops the block
                } else if(key.keyCode === 32){ //If the space key is pressed
                    flashUp(); //Flash drops the block
                } else if(key.keyCode === 17){ //If the control key is pressed
                    blockStick(); //Flash drops the block
                }
            }
        }
     
     
        function moveLeft(){ //Moves the block left by changing the centre
            blockErase();
            leftEdge = current.some(index => (currentPosition + index) % width === 0); //If the block is at the left edge it is set to true
     
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
            rightEdge = current.some(index => (currentPosition + index) % width === width-1);
            if(!rightEdge){ //If the block is not on the right edge it can move right
                currentPosition +=1;
            }
            if(current.some(index => squares[currentPosition + index].classList.contains('filled'))){
                currentPosition -=1;
            }
            blockDraw();
        }
     
        function blockRotate() {
            blockErase();
            let blockRotated = false; //Used to iterate until a valid rotation is found
            //while loop here
            while(!blockRotated){
                leftEdge = current.some(index => (currentPosition + index) % width === 0); //If the block is at the left edge it is set to true
                rightEdge = current.some(index => (currentPosition + index) % width === width-1);
                let savedmovement = 0; //i dont think we use this?
                let savedrotation = currentRotation;
     
                if(currentPosition % 10 == 9){ //Checks if the centre block is on the edges as it can wrap to the other side
                    currentPosition +=1; //Will move the centre right before rotating
                    savedmovement += 1;
                }else if(currentPosition % 10 == 8){
                    currentPosition -= 1; //Will move the centre left before rotating
                    savedmovement -= 1;
                }
        
                currentRotation ++; //Iterates to the next rotation of block
                if(currentRotation === current.length+1){
                    currentRotation = 0;
                }
                current = Blocks[random][currentRotation];
        
                //Checks where the new block is
                if(!current.some(index => squares[currentPosition + index].classList.contains('filled'))){//if any squares dont overlap with "filled"
                    blockRotated = true;
                    current = Blocks[random][currentRotation];
                }else if(!current.some(index => squares[currentPosition + index + 1].classList.contains('filled'))){//if any squares dont overlap with "filled" a block up
                    blockRotated = true;
                    current = Blocks[random][currentRotation];
                    currentPosition += 1; //It will rotate the block, but also push it to the right side
                }else if(!current.some(index => squares[currentPosition + index - 1].classList.contains('filled'))){//if any squares dont overlap with "filled" a block up
                    blockRotated = true;
                    current = Blocks[random][currentRotation];
                    currentPosition -= 1; //It will rotate the block, but also push it to the left side
                }else if(!current.some(index => squares[currentPosition + index].classList.contains('filled'))){//if any squares dont overlap with "filled" a block up
                    blockRotated = true;
                    current = Blocks[random][currentRotation];
                    currentPosition -= width; //It will rotate the block, but also push it upwards
                    
                }else{ //If it cannot rotate it defaults back to the original rotation, but the rotation checking will keep iterating for a new rotation in the meantime
                    current = Blocks[random][savedrotation];
                    currentPosition -= savedmovement;
                }
                //Colour array rotation
                let colourSave = blockColour[0];
                blockColour[0] = blockColour[6];
                blockColour[6] = blockColour[8];
                blockColour[8] = blockColour[2];
                blockColour[2] = colourSave
     
                colourSave = blockColour[1];
                blockColour[1] = blockColour[3];
                blockColour[3] = blockColour[7];
                blockColour[7] = blockColour[5];
                blockColour[5] = colourSave
                //blockColour[4] needs no change as its the centre
            }
                blockDraw();      
        }
     
        function blockStick() {//Maybe cut these out and make more efficient because its repeated in blockrotate
            leftEdge = current.some(index => (currentPosition + index) % width === 0); //If the block is at the left edge it is set to true
            rightEdge = current.some(index => (currentPosition + index) % width === width-1);
     
            if(current.some(index => squares[currentPosition + index + 1].classList.contains('filled') && !rightEdge)
            || current.some(index => squares[currentPosition + index - 1].classList.contains('filled')) && !leftEdge){//if any squares dont overlap with "filled" a block up
                blockCheck(true); //Uses an unconditional statement to overlook the checks needed for a block to be filled
            }
            
        }
     
    //GAME OFF WINDOW FUNCTIONS_________________________________________________________________________________________________
     
        //Show preview squares
        const displaySquares = document.querySelectorAll('.preview div');
        const displayWidth = 3; //Gives the width of the Divs
     
        const nextBlock = [
            //Blocks[0]
            [1+displayWidth,1+displayWidth*2,2] //There is only currently 1 block in the array but more are intended
        ];
     
        function displayShape(){
            displaySquares.forEach(square => {
                square.classList.remove('block') //Clears the preview grid
            })
            nextBlock[nextRandom].forEach(index => { //Adds the next shape to the preview grid
                displaySquares[index].classList.add('block');
            })
        }
     
        startBtn.addEventListener('click', () =>{    
            if(paused == false){
                clearInterval(timerId);
                paused = true; //Pauses the game using this variable as you cannot directly check timerID for values
            }else{
                blockDraw(); //Redraws the block
                timerId = setInterval(moveUp, 500);
                paused = false;
                nextRandom = Math.floor(Math.random()*Blocks.length); //Resets the next random block
                displayShape();
            }
        })
     
    //PREVIEW AND MISC FUNCTIONALITY___________________________________________________________________________________________________________________________________________________________
     
        let testValue = 0;//Temporary to test if I can locally save variables like score__________________________________________________________
        refreshBtn.addEventListener('click', () =>{
            //Temporary to test if I can locally save variables like score__________________________________________________________
            testValue = localStorage.getItem('testNo')
            testValue ++;
            localStorage.setItem('testNo', testValue);
            document.getElementById('score').innerHTML = localStorage.getItem('testNo')
            //Temporary to test if I can locally save variables like score__________________________________________________________
     
            if (confirm('Are you sure you want to refresh')) {
                alert("refreshed");
                //instead of refreshing every variable via tedious means Im going to locally store necessary values
                location.reload();
                
                
            }else{
     
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
    
    