import { validate_types_1 } from "./types.js"
import { Zajil , int , string , float , array } from "./rpc.js";


function assert( condition ) {
    if( !condition ) {
        console.error( "test failed" )
        process.exit(-1)
    }
    console.log( "passed" );
}

class food {
    food_name = string;
    food_price = int;
}


class response {
    status = int;
    msg = string;
    data = {
        name : string,
        age: int,
        nums: array(int),
        fav_food:food
    }
}


// rpc confugration
let rpc = new Zajil( "rpc_v1" );


rpc.return( response )
rpc.params( string , int , string , float )
rpc.function (
    function register( name , age , subject , grade ) {
        
        // write code to register user <<<<

        const resp = new response;
        resp.status = 201;
        resp.msg = "created";

        return resp
    }
)


let ss = rpc.rpc_objects_lookup
console.log( ss );

assert (
    validate_types_1( {status:201 , msg:"good" , data: { name:"hussein" , age:21 , nums:[1,2,3] ,fav_food:{ food_name:"watermelon" , food_price:2 } } } , "$response" , rpc.rpc_objects_lookup )
);


assert (
    ! validate_types_1( {status:201 , msg:"good" , data: { name:"hussein" , age:21, nums:[1,2,"3"] } } , "$response" , rpc.rpc_objects_lookup )
);
