import React  from 'react';
import hitsvg from '../images/hit.svg';
const Board = (props) => {
    


    const handleClick = (cell,rowIndex,cellIndex)=>{
        
        if(props.gameFinished){return};
        if (isPlayer()){
            props.onPlace(rowIndex,cellIndex);
        }
        
        else if(props.turn===0){
            if (cell.status==='idle'){
                props.playerMove(rowIndex,cellIndex);
            }
            
        }
    
    }

    const handleCellColor = (cell) =>{
        if(cell.shipInside!==false){

            return cell.shipInside.ship.color;
        }
        else{
            return 'rgba(255, 255, 255, 0.608)';
        }
    }

    const handleCellStatus = (cell)=>{
        if(cell.status==='idle'){
            return '';
        }
        else{
            if(cell.shipInside===false){
                return <span>O</span>;
            }
            else{
                return <img src={hitsvg}/>;
            }
        }
    }

    const isPlayer =()=>{return props.user==='player'};

    return(
        <div className="game-board">
        {props.board.map((row,rowIndex)=>{
            return(
                row.map((cell,cellIndex)=>{
                    return(
                        <div onClick={(e)=>{handleClick(cell,rowIndex,cellIndex)}}
                         onMouseEnter={isPlayer() ? ((e)=>{props.handlePosition(rowIndex,cellIndex)}) : undefined}
                         
                         key={cellIndex} 
                         className='cell'
                         style={isPlayer() ? {backgroundColor:handleCellColor(cell)}:{backgroundColor:'rgba(255, 255, 255, 0.608)'}}>

                             {handleCellStatus(cell)}
                             
                        
                        </div>
                    )
                })
                
            )
        })
        }
        </div>
    );
};

export default Board;