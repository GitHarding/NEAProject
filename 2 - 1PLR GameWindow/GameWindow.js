document.addEventListener('DOMContentLoaded', () => {
    "use strict";
     
    //Initialises The DIV grid in the CSS
    let applyHTML = document.createDocumentFragment();
    let applyHTMLP = document.createDocumentFragment();
 
    //Game Border
    for(let i = 0; i < 10; i++){//Creates 10 squares to fill the top border of the game grid
        let divGen = document.createElement('div');
        divGen.style.backgroundColor = 'black';
        divGen.className = 'filled';
        applyHTML.appendChild(divGen);
    }
     
    //Game Blocks
    for(let i = 0; i < 200; i++){//Creates 200 squares to fill the game grid
        let divGen = document.createElement('div');

        if(i < 170){
            divGen.style.border = '1px solid brown';
            divGen.style.boxShadow = 'inset 0px 0px 0px 10px transparent';
            divGen.style.boxSizing = 'border-box';
        }else{
            divGen.style.border = '1px solid red'
            divGen.style.boxShadow = 'inset 0px 0px 0px 10px transparent';
            divGen.style.boxSizing = 'border-box';
        }
        applyHTML.appendChild(divGen);
    }
     
    //Game Preview Box
        for(let i = 0; i < 9; i++){//Creates 9 squares to fill the preview square
            let divGen = document.createElement('div');
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
        let pausedCountdown = 0; //Used to create a delay before the game is resumed
        let gameOverTrue = false; //Used to end the game and stop other functions
     
    //HTML INITIALISATION_________________________________________________________________________________________________
        let score = 0;
 
        //Block variables
        const solidBlock = [ //Original Test Block
            [0, 1, 2, 10, 11, 12, 20, 21, 22],
            [0, 1, 2, 10, 11, 12, 20, 21, 22],
            [0, 1, 2, 10, 11, 12, 20, 21, 22],
            [0, 1, 2, 10, 11, 12, 20, 21, 22]
        ];
        const aBlock = [ //Half L Block
            [1+width,1+width*2,2], //Stores each rotation of the same block shape
            [width, 1+width, 2+width*2],
            [1,width+1, width*2],
            [0,1+width, 2+width]
        ];
        const bBlock = [ //Nugget Block
            [1, 1+width, 2+width], //Stores each rotation of the same block shape
            [1+width, 1+width*2, 2+width],
            [width, 1+width, 1+width*2],
            [width, 1, 1+width]
        ];
        const cBlock = [//V Block
            [0, 1+width, 2], //Stores each rotation of the same block shape
            [2, 1+width, 2+width*2],
            [width*2, 1+width, 2+width*2],
            [0, 1+width, width*2]
        ];
        const dBlock = [ // "/" Block
            [0, 1+width, 2+width*2], //Stores each rotation of the same block shape
            [2, 1+width, width*2],
            [2+width*2, 1+width, 0],
            [width*2, 1+width, 2]
        ];
        const eBlock = [
            [1, 1+width, 1+width*2], //Stores each rotation of the same block shape
            [width, 1+width, 2+width],
            [1, 1+width, 1+width*2],
            [2+width, 1+width, width]
        ];
        const fBlock = [
            [1, 1+width, 1+width*2, 2+width*2], //Stores each rotation of the same block shape
            [width, width*2, 1+width, 2+width],
            [0, 1, 1+width, 1+width*2],
            [2, width, 1+width, 2+width]
        ];
        
        let Blocks = fBlock //Blocks are stored in 1 larger array - make sure this works because it doesnt look like it does
        let nextBlocks = aBlock;
        let blockColour = [ //Defaulted to green to prevent null values
            ['green'],['green'],['green'],
            ['green'],['green'],['green'],
            ['green'],['green'],['green']
        ];
        let nextBlockColour = [ //Defaulted to red to prevent null values
            ['red'],['red'],['red'],
            ['red'],['red'],['red'],
            ['red'],['red'],['red'] 
        ];
        const availableColours = [
            ['yellow'], ['red'], ['deepPink'], ['Green']
        ];
     
        let currentPosition = 180; //Position of the centre of the block on the board
        let currentRotation = 0; //the current rotation of the block
        let current = Blocks[0]; //Stores the current block and the current rotation
     
        let leftEdge = current.some(index => (currentPosition + index) % width === 0); //If the block is at the left edge it is set to true
        let rightEdge = current.some(index => (currentPosition + index) % width === width-1);
     
        //Variables are declared here as initialisations as otherwise it can affect their values in functions
        let initialising = true;
        let blocksToClear = []; //Takes all the blocks to clear, saves for later use
        let whiteClear = []; //Used to display to the player that blocks are being cleared
 
        //Show preview squares
        const displaySquares = document.querySelectorAll('.preview div');
     
    //BLOCK/GAME INITIALISATION_________________________________________________________________________________________________
        if(initialising == true){
            for(let i=0;i < blockColour.length; i++){
                blockColour[i] = availableColours[Math.floor(Math.random() * availableColours.length)];
                nextBlockColour[i] = availableColours[Math.floor(Math.random() * availableColours.length)];
            }
            Blocks = randomBlock();
            current = Blocks[0];
            nextBlocks = randomBlock();
            
 
            initialising = false; //Sets initialising to false as it has finished to initialise
            blockDraw(); //Draws the block in the game window
            displayShape(); //Displays the shape in the preview window
        }
 
        function randomBlock(){ //Function to return a random set of Blocks as it is used in multiple instances, for efficient code
            let result
            switch(Math.floor(Math.random() * 6 + 1)){
                case 1:
                    result = aBlock;
                    break;
                case 2:
                    result = bBlock;
                    break;
                case 3:
                    result = cBlock;
                    break;
                case 4:
                    result = dBlock;
                    break;
                case 5:
                    result = eBlock;
                    break;
                case 6:
                    result = fBlock;
                    break;
                }
                return result;
        }
        
        function instantiateBlock(){
            if(gameOverTrue == false){
                currentRotation = 0; //Resets the block rotation
                currentPosition = 180; //Resets the block position
                Blocks = nextBlocks; //The next block is moved to the current, and a new one is generated below
                current = Blocks[currentRotation]; //current is set to the new block, using the current rotation to default back to
    
                for(let i=0;i < blockColour.length; i++){
                    blockColour[i] = nextBlockColour[i];
                    nextBlockColour[i] = availableColours[Math.floor(Math.random() * availableColours.length)]
                }
                nextBlocks = randomBlock();
                displayShape(); //Displays the new shape in the preview window
            }
        }
     
        function blockDraw() {
            if(gameOverTrue == false){
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
        }
     
        function blockErase(){ //Removes all instances of the block, similar to a canvas clearing
            current.forEach(index => {
                squares[currentPosition + index].classList.remove('block');
                squares[currentPosition + index].style.removeProperty("background-color");
            })
        }
     
        //Timer functionality
        function moveUp(){
            if(gameOverTrue == false){
                if(paused == true){
                    document.getElementById("scoreP1").innerHTML = ("Player 1 <br>Score: " + score + "<br> P A U S E D <br>begins in " + (3-pausedCountdown))
                    pausedCountdown ++;
                    if(pausedCountdown > 3){
                        paused = false; //Will play the game after 3*500ms countdown
                        pausedCountdown = 0; //Resets the pausedcoundown variable
                    }
                }else{
                    document.getElementById("scoreP1").innerHTML = ("Player 1 <br>Score: " + score)
                    let grids = document.getElementsByClassName('gameGrid'); //Changes the background of all gamegrid elements to show its paused
                    if(timerId != 1){
                        for(let i=0; i<grids.length; i++) {
                            grids[i].style.backgroundColor = 'maroon';
                        }
                    }

                    leftEdge = current.some(index => (currentPosition + index) % width === 0); //If the block is at the left edge it is set to true
                    rightEdge = current.some(index => (currentPosition + index) % width === width-1);
                    blockCheck(false); //Checks the block at the end of the cycle - could be moved to before the cycle to create a sliding effect?
                    blockErase(); //Erases the block from the "canvas"
                    currentPosition -= width; //Adds 10 to the value to raise the block downward
                    blockDraw(); //Redraws the block afterwards
                }
            }
        }
        
     
     
        function flashUp(){
            let flashable = true; //Checks if a flash block can occur
            let flashDistance = 0; //Checks the distance of a flash drop for it to happen
            while(flashable == true){
                if(!current.some(index => squares[currentPosition + index - width - flashDistance].classList.contains('filled'))){
                    flashDistance += width; //Moves the block up a row to check if it can still keep moving upwards
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
            //Gravity Variables (Needed here as it is called in block placement)
            let gravityCheck = []; //Checks for blocks affected by gravity
            let gravityAffect = []; //Takes the blocks that are able to be affected by gravity

            let clearing = false;
            for(let i = 0; i < whiteClear.length; i++){
                whiteClear[i].style.backgroundColor = "transparent";
            }
            whiteClear = [];

            for(let i = 0; i < whiteClear.length; i++){
                whiteClear[i].style.backgroundColor = "white";
            }

            if(current.some(index => squares[currentPosition + index - width].classList.contains('filled')) || unconditional){
                current.forEach(index => squares[currentPosition + index].classList.add('filled')); //Make the block currently being controlled act as a filler block and stick
                current.forEach(index => { //For each block newly placed it will reiterate <- this works fine
     
                    let matchingBlocks = []; //Creates an array of all the blocks that need to be destroyed, also being used to keep the flower search iterating
                    let arrayIndex = 0; //Used to iterate the while loop for the flower search
                    matchingBlocks.push(currentPosition + index) //Puts the current selected block into the flower search array to start the search
                    
                    while(arrayIndex < matchingBlocks.length){
                        //Checking for blocks to the right will be ignored if the current block is at the right edge
                        if(squares[matchingBlocks[arrayIndex]].style.backgroundColor === squares[(matchingBlocks[arrayIndex]) + 1].style.backgroundColor && !(matchingBlocks.includes(matchingBlocks[arrayIndex] + 1)) && !(((squares.indexOf(squares[matchingBlocks[arrayIndex]])) % 10) - 9==0)){
                            matchingBlocks.push(matchingBlocks[arrayIndex] + 1); //If the block is to the right it adds it to the flowering array
                        }
                        //Checking for blocks to the left will be ignored if the current block is at the left edge
                        if(squares[matchingBlocks[arrayIndex]].style.backgroundColor === squares[(matchingBlocks[arrayIndex]) - 1].style.backgroundColor && !(matchingBlocks.includes(matchingBlocks[arrayIndex] - 1)) && !(((squares.indexOf(squares[matchingBlocks[arrayIndex]])) % 10==0))){   
                            matchingBlocks.push(matchingBlocks[arrayIndex] - 1); //If the block is to the left it adds it to the flowering array
                        }
                        if(squares[matchingBlocks[arrayIndex]].style.backgroundColor === squares[(matchingBlocks[arrayIndex]) + width].style.backgroundColor && !(matchingBlocks.includes(matchingBlocks[arrayIndex] + width))){
                            matchingBlocks.push(matchingBlocks[arrayIndex] + width); //If the block is above it adds it to the flowering array
                        }
                        if(squares[matchingBlocks[arrayIndex]].style.backgroundColor === squares[(matchingBlocks[arrayIndex]) - width].style.backgroundColor && !(matchingBlocks.includes(matchingBlocks[arrayIndex] - width))){
                            matchingBlocks.push(matchingBlocks[arrayIndex] - width); //If the block is below it adds it to the flowering array
                        }
                        arrayIndex++; //Iterates the loop 
                    }
                    if(arrayIndex >= 5){
                        for(let i = matchingBlocks.length - 1; i > -1; i--){//afterwards clears them
                            blocksToClear.push(squares[matchingBlocks[i]]); //Pushes all the blocks to an outside array, it cannot clear the blocks within the "newly placed blocks" as it potentially clears unchecked blocks                        
                        }
                    }
 
                    matchingBlocks = []; //Resets matching blocks to check for the next block
                });
                clearing = true;
            }
 
            //Gets rid of duplicate Divs in an array
            for(let i = 0; i < blocksToClear.length -1; i++){
                for(let j = i+1; j < blocksToClear.length - 1; j++){
                    if(i == j){
                        blocksToClear.splice(j,1);
                    }
                }
            }

            //Clears all of the blocks
            for(let i = blocksToClear.length - 1; i> -1; i--){
                score ++;
                blocksToClear[i].classList.remove('filled'); //Removes all the required classes and colours
                blocksToClear[i].classList.remove('block'); 
                blocksToClear[i].style.removeProperty("background-color");
                whiteClear.push(blocksToClear[i]);
            }

            let gravityCheckLoop = 0;
            while(gravityCheckLoop != 1){

                //Gravity
                //for loop using the sides (10,20 etc and  19,29,39+ bottom 10,11,12,13,14,15,16,17,18,19,20)
                for(let i = 10; i < 20; i++){
                    if(squares[i].classList.contains('block')){
                        gravityCheck.push(i);
                    }
                }

                let arrayGIndex = 0;
                while(arrayGIndex < gravityCheck.length){
                    if(squares[(gravityCheck[arrayGIndex]) + 1]){
                        if(squares[(gravityCheck[arrayGIndex]) + 1].classList.contains("filled") && !(gravityCheck.includes(gravityCheck[arrayGIndex] + 1))){
                            gravityCheck.push(gravityCheck[arrayGIndex] + 1); //If the block is to the right it adds it to the flowering array
                        }
                    }
                    if(squares[(gravityCheck[arrayGIndex]) - 1]){
                        if(squares[(gravityCheck[arrayGIndex]) - 1].classList.contains("filled") && !(gravityCheck.includes(gravityCheck[arrayGIndex] - 1))){
                            gravityCheck.push(gravityCheck[arrayGIndex] - 1); //If the block is to the left it adds it to the flowering array
                        }
                    }
                    if(squares[(gravityCheck[arrayGIndex]) + width]){
                        if(squares[(gravityCheck[arrayGIndex]) + width].classList.contains("filled") && !(gravityCheck.includes(gravityCheck[arrayGIndex] + width))){
                            gravityCheck.push(gravityCheck[arrayGIndex] + width); //If the block is above it adds it to the flowering array
                        }
                    }
                    if(squares[(gravityCheck[arrayGIndex]) - width]){
                        if(squares[(gravityCheck[arrayGIndex]) - width].classList.contains("filled") && !(gravityCheck.includes(gravityCheck[arrayGIndex] - width)) && (gravityCheck[arrayGIndex] - width) > 10){
                            gravityCheck.push(gravityCheck[arrayGIndex] - width); //If the block is below it adds it to the flowering array
                        }
                    }
                    if(squares[(gravityCheck[arrayGIndex]) + width + 1]){
                        if(squares[(gravityCheck[arrayGIndex]) + width + 1].classList.contains("filled") && !(gravityCheck.includes(gravityCheck[arrayGIndex] + width + 1))){
                            let notInCurrent = false;
                            for(let i = 0; i < current.length; i++){
                                if(squares[(gravityCheck[arrayGIndex])]){
                                    notInCurrent =true;
                                }
                            }
                            if(notInCurrent == true){
                                gravityCheck.push(gravityCheck[arrayGIndex] + width + 1); //If the block is up and left it adds it to the flowering array
                            }
                        }
                    }
                    if(squares[(gravityCheck[arrayGIndex]) + width - 1]){
                        if(squares[(gravityCheck[arrayGIndex]) + width - 1].classList.contains("filled") && !(gravityCheck.includes(gravityCheck[arrayGIndex] + width - 1))){
                            let notInCurrent = false;
                            for(let i = 0; i < current.length; i++){
                                if(squares[(gravityCheck[arrayGIndex]) + width - 1]){
                                    notInCurrent =true;
                                }
                            }
                            if(notInCurrent == true){
                                gravityCheck.push((gravityCheck[arrayGIndex]) + width - 1); //If the block is up and right it adds it to the flowering array
                            }
                        }
                    }
                    if(squares[(gravityCheck[arrayGIndex]) - width + 1]){
                        if(squares[(gravityCheck[arrayGIndex]) - width + 1].classList.contains("filled") && !(gravityCheck.includes(gravityCheck[arrayGIndex] - width + 1))&& (gravityCheck[arrayGIndex] - width) >= 10){
                            let notInCurrent = false;
                            for(let i = 0; i < current.length; i++){
                                if(squares[(gravityCheck[arrayGIndex]) - width + 1]){
                                    notInCurrent = true;
                                }
                            }
                            if(notInCurrent == true){
                                gravityCheck.push((gravityCheck[arrayGIndex]) - width + 1); //If the block is up and left it adds it to the flowering array
                            }
                        }
                    }
                    if(squares[(gravityCheck[arrayGIndex]) - width - 1]){
                        if(squares[(gravityCheck[arrayGIndex]) - width - 1].classList.contains("filled") && !(gravityCheck.includes(gravityCheck[arrayGIndex] - width - 1)) && (gravityCheck[arrayGIndex] - width) >= 10){
                            let notInCurrent = false;
                            for(let i = 0; i < current.length; i++){
                                if(squares[(gravityCheck[arrayGIndex]) - width - 1]){
                                    notInCurrent =true;
                                }
                            }
                            if(notInCurrent == true){
                                gravityCheck.push((gravityCheck[arrayGIndex]) - width - 1); //If the block is up and left it adds it to the flowering array
                            }
                        }
                    }
                    arrayGIndex++; //Iterates the loop
                }

                for(let i = squares.length - 1; i > -1; i--){
                    if(!gravityCheck.includes(i)){
                        if(squares[i].style.backgroundColor && squares[i].style.backgroundColor != "black" && squares[i].classList.contains('filled')){
                            gravityAffect.push(i)
                            whiteClear.push(squares[i]);
                        }
                    }
                }

                for(let i = gravityAffect.length - 1; i > -1; i--){
                    score -= 0.5;
                    squares[gravityAffect[i]].style.backgroundColor = "transparent" //Removes gravity affected blocks and all values within them
                    squares[gravityAffect[i]].classList.remove('block');
                    squares[gravityAffect[i]].classList.remove('filled'); 
                }
                for(let i = 0; i < whiteClear.length; i++){
                    whiteClear[i].style.backgroundColor = "white";
                }
                gravityCheckLoop ++;
            }

            document.getElementById("scoreP1").innerHTML = ("Player 1 <br>Score: " + score)
            blocksToClear = [];
            gravityCheck = [];

            if(clearing == true){
                //New block instantiating
                instantiateBlock();
                blockDraw(); //Draws the new instantiated block
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
            lastPressed = now;
            lastKeyCode = key.keyCode;
     
            if(!paused){ //User can use the control keys on keyboards if the game is un-paused
                if(key.keyCode === 65){ //If the left arrow is pressed
                    moveLeft();
                } else if(key.keyCode === 83){ //If the down arrow is pressed
                    blockCheck(false); //Checks the blocks before it rotates
                    blockRotate(); //Then rotates the block
                } else if(key.keyCode === 68){ //If the right arrow is pressed
                    moveRight();
                } else if(key.keyCode === 87){ //If the up arrow is pressed
                    moveUp(); //Fast drops the block
                } else if(key.keyCode === 81){ //If the space key is pressed
                    flashUp(); //Flash drops the block
                } else if(key.keyCode === 69){ //If the control key is pressed
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
                if(currentRotation == Blocks.length){
                    currentRotation = 0;
                }
 
                current = Blocks[currentRotation];
                //Checks where the new block is
                if(!current.some(index => squares[currentPosition + index].classList.contains('filled'))){//if any squares dont overlap with "filled"
                    blockRotated = true;
                    current = Blocks[currentRotation];
                }else if(!current.some(index => squares[currentPosition + index + 1].classList.contains('filled'))){//if any squares dont overlap with "filled" a block up
                    blockRotated = true;
                    current = Blocks[currentRotation];
                    currentPosition += 1; //It will rotate the block, but also push it to the right side
                }else if(!current.some(index => squares[currentPosition + index - 1].classList.contains('filled'))){//if any squares dont overlap with "filled" a block up
                    blockRotated = true;
                    current = Blocks[currentRotation];
                    currentPosition -= 1; //It will rotate the block, but also push it to the left side
                }else if(!current.some(index => squares[currentPosition + index].classList.contains('filled'))){//if any squares dont overlap with "filled" a block up
                    blockRotated = true;
                    current = Blocks[currentRotation];
                    currentPosition -= width; //It will rotate the block, but also push it upwards
                    
                }else{ //If it cannot rotate it defaults back to the original rotation, but the rotation checking will keep iterating for a new rotation in the meantime
                    current = Blocks[savedrotation];
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
     
     
        function displayShape(){
            displaySquares.forEach(square => {
                square.classList.remove('block') //Clears the preview grid
                square.style.backgroundColor = ('transparent');
            })            
            nextBlocks[0].forEach(index =>  { //Adds the next shape to the preview grid
                let previewPos = 0; //Resets the preview position
                if(index == null){ //If the next index has no value it skips adding a block into the grid
                }else{
                    if(index.toString().length == 2){ //The first digit of the substring shows horizontal placement, part of the translation from a 10*3 grid
                        if(index.toString().substring(0,1) == 0){
                            //previewPos +=0;
                        }else if(index.toString().substring(0,1) == 1){
                            previewPos += 3;
                        }else{
                            previewPos += 6;
                        }
 
                        if(index.toString().substring(1,2) == 0){//The second digit of the substring shows vertical placement, part of the translation from a 10*3 grid
                            //previewPos += 0;
                        }else if(index.toString().substring(1,2) == 1){
                            previewPos += 1;
                        }else{
                            previewPos += 2;
                        }
                    }else{
                        if(index.toString().substring(0,1) == 0){
                            //previewPos += 0;
                        }else if(index.toString().substring(0,1) == 1){
                            previewPos += 1;
                        }else{
                            previewPos += 2;
                        }
                    }
                }
                displaySquares[previewPos].classList.add('block'); //Adds a block to the next position
            })
 
            for(let index = 0; index < 9; index++){ //Adds a colour value to the block
                if(displaySquares[index].classList.contains('block')){
                    displaySquares[index].style.backgroundColor = (nextBlockColour[index]);
                }    
            }
        }
     
        startBtn.addEventListener('click', () =>{    
            gamePause();
        })

        function gamePause(){
            if(paused == false){
                let grids = document.getElementsByClassName('gameGrid'); //Changes the background of all gamegrid elements to show its paused
                for(let i=0; i<grids.length; i++) {
                  grids[i].style.backgroundColor = 'Sienna';
                }
 
                clearInterval(timerId);
                paused = true; //Pauses the game using this variable as you cannot directly check timerID for values
                startBtn.blur();//Deselects the button from the mouse
            }else{
                startBtn.disabled = false;
                blockDraw(); //Redraws the block
                clearInterval(timerId); //Needs to clear the interval otherwise there will be several individual calls at 500ms
                timerId = setInterval(moveUp, 500);
                
                startBtn.blur();//Deselects the button from the mouse
            }
        }
     
    //PREVIEW AND MISC FUNCTIONALITY___________________________________________________________________________________________________________________________________________________________
        let testValue = 0;//Temporary to test if I can locally save variables like score
        refreshBtn.addEventListener('click', () =>{
            testValue = localStorage.getItem('testNo');
            testValue ++;
            localStorage.setItem('testNo', testValue);
            document.getElementById('scoreP1').innerHTML = localStorage.getItem('testNo')
     
            if (confirm('Are you sure you want to refresh')) {
                alert("refreshed");
                //instead of refreshing every variable via tedious means Im going to locally store necessary values
                location.reload();                
            }else{
     
            }
        })
     
        function gameOver() { //Game Over Functionality
            gameOverTrue = false;
            for(let i = 180; i < 210; i++){

                if(squares[i].classList.contains('filled')){
                    console.log(squares[i])
                    gameOverTrue = true;
                    squares[i].style.backgroundColor = 'black';
                    console.log(squares[i])
                }
            }
            if(gameOverTrue == true){
                startBtn.disabled = true;
                document.getElementById("scoreP1").innerHTML = ("Player 1 <br>Score: " + score + " <br> Game Over"); //Used to display to the player that the game is over
                clearInterval(timerId); //Stops the incrementing timer that plays the game
                paused = true; //Pauses the game
                alert("G A M E  - -  O V E R");
                document.getElementById("scoreP1").innerHTML = ("Player 1 <br>Score: " + score + " <br> Game Over"); //Used to display to the player that the game is over
            }
        }
    })
    
    

