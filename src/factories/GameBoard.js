import Ship from './Ship.js'
import sound1 from '../sounds/hit.mp3';
import sound2 from '../sounds/splash.mp3';


var hitSound = new Audio(sound1);
var splashSound = new Audio(sound2);
const logs = [
    {playerMiss:'You missed'},
    {aiMiss:'Computer missed'},
    {playerHit:'You hit, keep going'},
    {aiHit: 'You are hit!'}
]
const GameBoard = (() => {
    return{
    createNewBoard(){
        let board = [[]];
        for(let i=0; i<10; i++){
            board[i] = new Array(10).fill().map(()=>({status:'idle', shipInside:false}));
        }
        
        return board;
    },
    createShipSet(){
        let shipSet = [Ship(5),Ship(4),Ship(3), Ship(2), Ship(2), Ship(1), Ship(1)];
        return shipSet;
    },

    copyBoard(board){
        let newBoard = [[]];

        for(let i=0; i<10; i++){
            newBoard[i] = board[i].map((cell)=>({...cell}));
        }

        return newBoard;
    },

    placeShip(board,coordX,coordY,rotation,Ship){
        let newBoard = [[]];

        for(let i=0; i<10; i++){
            newBoard[i] = board[i].map((cell)=>({...cell}));
        }
        
        
        if(rotation==='H'){
            for(let i=coordY; i<coordY+Ship.length;i++){
                if(newBoard[coordX][i].shipInside !==false){
                    throw 'Not valid';
                };
            }
            if((coordY+Ship.length-1)>9 || newBoard[coordX][coordY].shipInside!==false){return false};
                

                for(let i=coordY; i<coordY+Ship.length;i++){
                    newBoard[coordX][i].shipInside = Object.assign({},{ship:Ship, shipPart:i-coordY});
                }
                
                return newBoard;
            
        }
        else{
            for(let i=coordX; i<coordX+Ship.length;i++){
                if(newBoard[i][coordY].shipInside !==false){
                    throw 'Not valid';
                };
            }
            if((coordX+Ship.length-1)>9 || newBoard[coordX][coordY].shipInside!==false){return false};
                
                for(let i=coordX; i<coordX+Ship.length;i++){
                    
                    newBoard[i][coordY].shipInside = Object.assign({},{ship:Ship, shipPart:i-coordX});
                }
                return newBoard;
            
        }
        

    },

    clearShip(board,coordX,coordY,rotation,Ship){
        let newBoard = [[]];

        for(let i=0; i<10; i++){
            newBoard[i] = board[i].map((cell)=>({...cell}));
        }

        if(rotation==='H'){
            
            if(newBoard[coordX][coordY].shipInside!==false){
                for(let i=coordY; i<coordY+Ship.length;i++){
                    newBoard[coordX][i].shipInside = false;
                }
            return newBoard;
            }

        }
        else{
            if(newBoard[coordX][coordY].shipInside!==false){
                
                for(let i=coordX; i<coordX+Ship.length;i++){
                    newBoard[i][coordY].shipInside = false;
                    console.log(newBoard[i][coordY].shipInside);
                }
                console.log(newBoard);
            return newBoard;
            }
            
        }
        

    },

    

    receiveAttack(board,coordX,coordY){
        let newBoard = [[]];

        for(let i=0; i<10; i++){
            newBoard[i] = board[i].map((cell)=>({...cell}));
        }

        let cell = newBoard[coordX][coordY];
        
        
        if(cell.status==='idle' && cell.shipInside!==false){
            cell.shipInside.ship.hit(cell.shipInside.shipPart);
            cell.status='shot';
            hitSound.play();
            return {newBoard:newBoard,result:'hit'};
        }
        cell.status='shot';
        splashSound.play();
        return {newBoard:newBoard,result:'miss'};
    },

    checkEnd(shipSet){
        for(let i=0;i<7;i++){
            if(!shipSet[i].isSunk()){return false}
        }
        return true
    }

    }
})();

export default GameBoard;