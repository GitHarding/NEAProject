document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.querySelector('#startButton');
    let timerId;

    const ScoreDisplay = document.querySelector('#score');
    const StartBtn = document.querySelector('#startButton');
    const grid = document.querySelector('.gameGrid');

    let squares = Array.from(document.querySelectorAll('.gameGrid div'));
    const width = 10;

    //Blocks
    const testBlock = [
        //[0,1+width, 2+width*2] How the basic grid system works

        [1+width,1+width*2,2],

        [width, 1+width, 2+width*2],

        [1,width+1, width*2],

        [0,1+width, 2+width]
    ]

    const Blocks = [testBlock];
    let random = 0;

    let currentPosition = 4;//183;
    let currentRotation = 0;
    let current = Blocks[0][0];
    let nextRandom = 0;



    function blockDraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('block');
        })
    }

    function blockErase(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('block');
        })
    }

    //Timer functionality
    function moveDown(){
        blockErase();
        currentPosition += width;
        blockDraw();
        blockCheck();
    }

    //Block collision checking functionality
    function blockCheck(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('filled'))){
            current.forEach(index => squares[currentPosition + index].classList.add('filled'));
            //Instantiate a new Block
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * Blocks.length);
            current = Blocks[0][0];
            currentPosition = 4;//183;
            blockDraw();
            displayShape();
        }
    }

    //input dedicated functions

    function control(key) {
        if(key.keyCode === 37){
            moveLeft();
        } else if(key.keyCode === 38){
            blockRotate();
        } else if(key.keyCode === 39){
            moveRight();
        } else if(key.keyCode === 40){
            //down
        }
    }
    document.addEventListener('keydown', control);

    function moveLeft(){
        blockErase();
        const leftEdge = current.some(index => (currentPosition + index) % width === 0);

        if(!leftEdge){
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
        currentRotation ++;
        if(currentRotation === current.length+1){
            currentRotation = 0;
        }
        current = Blocks[random][currentRotation];
        blockDraw();
    }


    //Show preview square
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
        if(timerId){
            clearInterval(timerId);
        }else{
            blockDraw()
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*Blocks.length);
            displayShape();
        }
    })




})