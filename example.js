
import express from 'express';
import { Zajil , int , string , float } from "./rpc.js";
import { validate_types_1 } from "./types.js"


// class templates to be shared with frontend
class response {
    status = int;
    msg = string;
    data = {
        name : string,
        age: int
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
        resp.msg = "created"

        return resp
    }
)


rpc.return( response )
rpc.params( string , int , string , float )
rpc.function ( 
    function some_other_stuffs( name , age , subject , grade ) {
        
        // write code to register user <<<<

        const resp = new response;
        resp.status = 201;
        resp.msg = "created"

        return resp
    }
)

//console.log( rpc.rpc_objects_lookup );

let a = validate_types_1( {status:201 , msg:"good" , data: { name:"hussein" , age:21 } } , "$response" , rpc.rpc_objects_lookup );

console.log( "valid: ", a );

const app = express()

// connecting rpc to express.js
rpc.linkApp(app);

app.listen(8080);
