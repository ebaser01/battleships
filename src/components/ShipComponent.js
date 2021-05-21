import React from 'react';

function ShipComponent(props){

    const Ship = props.Ship;

    ;
    return(
        <div className={"ship"} style={{}}>
            {(Ship.shipFragments).map(
                (piece,index)=>{
                    return(
                        <div key={index} className='ship-piece' style={{backgroundColor:`${Ship.color}`}}>

                        </div>
                    )
                })
            }
        </div>
    );
}

export default ShipComponent;
