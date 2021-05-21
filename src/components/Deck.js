import React from 'react';
import Ship from '../factories/Ship';
import ShipComponent from './ShipComponent';

function Deck(props){
    

    return(
        <div className='deck'>
            {props.shipSet.map((s)=>{
                return(
                    <ShipComponent key={s.id} Ship={s}/>
                )
            })}
        </div>
    );
}

export default Deck;