import Header from './Header';
import Board from './Board';
import Deck from './Deck';

import GameBoard from '../factories/GameBoard'

import React, {useEffect, useState} from 'react';

const aiMoves = [];
for(let i=0; i<10; i++){
    for(let j=0; j<10; j++){
        aiMoves.push([i,j]);
    }
}

var playerShipSet = GameBoard.createShipSet();
var aiShipSet = GameBoard.createShipSet();

const Main = (props) => {
    
    const [board, setBoard] = useState(GameBoard.createNewBoard());
    const [prevBoard , setPrevBoard] = useState(GameBoard.createNewBoard());
    const [shipDirection, setShipDirection] = useState('V');
    const [cursor, setCursor] = useState({X:0,Y:0});

    const [turn,setTurn] = useState(0);

    const [aiBoard, setAiBoard] = useState(GameBoard.createNewBoard());

    const [shipSet, setShipSet] = useState(playerShipSet);

    const [gameStarted, setGameStarted]= useState(0);
    const [gameFinished, setGameFinished]= useState(0);
    
    const [gameLog, setGameLog] = useState('');

    useEffect(()=>{
        const directionHandler = (e)=>{
            if(e.code==='KeyR'){
                
                setShipDirection((shipDirection)=> shipDirection==='H' ? 'V' : 'H');
                
            }
        }

        window.addEventListener('keydown', directionHandler)

        return () => {
            window.removeEventListener('keydown', directionHandler);
          }
    },[])


    useEffect(()=>{

        onPreview();

    },[cursor.X,cursor.Y,shipDirection]);



    const handlePosition = (coordX,coordY)=>{

        setCursor(Object.assign({},{X:coordX,Y:coordY}));

    }

    const onPreview = () =>{
        try {       
            let tempBoard = GameBoard.placeShip(board,cursor.X,cursor.Y,shipDirection,shipSet[0]);
            setPrevBoard(tempBoard);      
            
        } catch (error) {
            
        }

    }

    const aiMove = async() =>{
        let moveCoords=0;
        

        await new Promise(r => setTimeout(r, 700));
        
        
        let coordIndex = Math.floor(Math.random()*aiMoves.length);
        
        moveCoords = aiMoves[coordIndex];
        
        aiMoves.splice(coordIndex,1);
        
        let attack = GameBoard.receiveAttack(board,moveCoords[0],moveCoords[1]);

        let newPlayerBoard = attack.newBoard;
        
        if(attack.result==='hit'){
            setGameLog('aihit');
        }
        else{
            setGameLog('aimiss');
        }
        setBoard(newPlayerBoard);
        await new Promise(r => setTimeout(r, 900));
        if(checkFinish(playerShipSet)){
            setGameLog('aiwon');
            setGameFinished(1);
        }
        setGameLog('playerturn');
        setTurn(0);
        
    }

    const playerMove = async(coordX,coordY) => {
        setTurn(1);
        
        let attack = GameBoard.receiveAttack(aiBoard,coordX,coordY);
        let newaiBoard = attack.newBoard;

        setAiBoard(newaiBoard);
        setGameLog(attack.result);
        
        
        await new Promise(r => setTimeout(r, 1000));
        if(checkFinish(aiShipSet)){
            setGameLog('playerwon');
            setGameFinished(1);
        }
        setGameLog('aiturn');
        aiMove();
        
    }

    const checkFinish = (shipSet)=>{
        return GameBoard.checkEnd(shipSet);
    }

    const onPlace = (coordX,coordY) =>{
        

        try {
            let tempBoard = (GameBoard.placeShip(board,coordX,coordY,shipDirection,shipSet[0]));
            
            let newShipset = [...shipSet];
            newShipset.splice(0,1);
            setBoard(tempBoard);
            setShipSet(newShipset);
            
        } catch (error) {
            console.log(error);
        }
        
    }

    const placeShipsRandomly = (board)=> {
        
            let randomBoard = GameBoard.createNewBoard();
            let shipSet = aiShipSet;
            let shipOrder = 0;
    
    
            while(shipOrder<7){
                
                let direction = Math.random()<0.5 ? 'H' : 'V';
                
                if(direction==='H'){
                    let coordY = Math.floor(Math.random()*(10-shipSet[shipOrder].length));
                    let coordX = Math.floor(Math.random()*10);
                    try {
                        randomBoard = GameBoard.placeShip(randomBoard,coordX,coordY,direction,shipSet[shipOrder]);

                    } catch (error) {
                        continue;
                    }
                }
                else{
                    let coordX = Math.floor(Math.random()*(10-shipSet[shipOrder].length));
                    let coordY = Math.floor(Math.random()*10);
                    
                    try {
                        randomBoard = GameBoard.placeShip(randomBoard,coordX,coordY,direction,shipSet[shipOrder]);

                    } catch (error) {
                        continue;
                    }
    
                }       
                shipOrder++;
            }   
           console.log(randomBoard);
           return randomBoard;
        
    }

    const handleStart = async()=>{
        await new Promise(r => setTimeout(r, 200));
        let tempBoard = placeShipsRandomly(aiBoard);
        setAiBoard(tempBoard);
        setGameStarted(1);
    }

    const handleRestart = ()=>{
        setBoard(GameBoard.createNewBoard());
        setPrevBoard(GameBoard.createNewBoard());
        setAiBoard(GameBoard.createNewBoard());
        
        playerShipSet = GameBoard.createShipSet();
        aiShipSet = GameBoard.createShipSet();

        setShipSet(playerShipSet);

        setGameStarted(0);
        setGameFinished(0);
    }

    const handleLogs = () =>{
        if(!gameStarted){return ''};
        if(gameFinished){
            return 'YOU WON THE GAME, CONGRATS';
        }

        if(gameLog==='hit'){
            return 'Good one, keep going';
        }
        else if(gameLog==='miss'){
            return 'You missed!';
        }
        else if(gameLog==='aiturn'){
            return 'Computer is thinking';
        }
        else if(gameLog==='aihit'){
            return 'Computer hit you!';
        }
        else if(gameLog==='aimiss'){
            return 'Computer missed';
        }
        else if(gameLog==='playerwon'){
            return 'You won the game';
        }
        else if(gameLog==='aiwon'){
            return 'Computer won the game';
        }
        else{
            return 'Your turn';
        }
    }

    return(
        
        <div className="main">
            <Header/>
            <div className='board-container'>
                <Board user='player' board={gameStarted===0?prevBoard:board} onPlace={onPlace} handlePosition={handlePosition} turn={turn} gameFinished={gameFinished} />
                {shipSet.length!==0 ? 
                <Deck shipSet={shipSet}/> : 
                gameStarted===0?<div className='button-container'><button className='start-button' onClick={handleStart}>Start</button></div>:''}

                {gameStarted===1?
                <Board user='ai' turn={turn} board={aiBoard} playerMove={playerMove} gameFinished={gameFinished}/>:
                ''}
            </div>
            {gameStarted===1?<div className='log-board'><span>{handleLogs()}</span></div>:''}
            {gameFinished===1?<button onClick={handleRestart}>RESTART</button>:''}
        </div>
    );
};

export default Main;