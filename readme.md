Call backend functions from the frontend directly (WIP)


### TODO:
- [ ] Client library
- [ ] Authentication



## How to use

```javascript

import express from 'express';
import { Zajil , int , string , float } from "./rpc.js";


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


const app = express()

// connecting rpc to express.js
rpc.linkApp(app);

app.listen(8080);

```
