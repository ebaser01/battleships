import uniqid from 'uniqid';


const Ship = (length) =>{
    let color = 'white';

    switch(length){
        default:
            break;
        case(1):
            color = 'red';
            break;
        case(2):
            color = 'green';
            break;
        case(3):
            color = 'purple';
            break;
        case(4):
            color = 'blue';
            break;
        case(5):
            color = 'magenta';
            break;
    };
    return{
        id:uniqid(),
        color,
        length: length,
        shipFragments: new Array(length).fill('alive'),
        hit(coord){           
            this.shipFragments[coord] = 'hit';
            
        },

        isSunk(){
            for(let i=0; i<this.length; i++){
                if(this.shipFragments[i]==='alive'){
                    return false;
                }
            }
            return true;
        }
    }
}

export default Ship;