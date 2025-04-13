# Zajil RPC (WIP)
make backend data types and functions accessible from frontend.

No need to make complicated REST APIs just to call the backend function you want to call using REST API.

Type-safe communication channel and forces javascript to use safe integers for better accuracy. 

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


### Author
> By Hussein Layth Al-Madhachi
