import { process_type_schema } from "./types.js";


// foreign imports!!!   20% tarrifs gets applied in the US  :)
import express from 'express';





export const int="int" , float="flt" , string="str";

export const array = ( member_type ) => {
    return "@"+member_type
}



class rpc_call {
    callback = ()=>{};
    return_type = null;
    params = [];
}




export class Zajil {


    constructor ( api_path ) {

        this.api_path = api_path;
        this.rpc_callback_lookup = {}
        this.rpc_objects_lookup = {}

    }


    params(...types) {
        
        for( let type of types ) {
            // the code below will throw an error and stop the program if type schemas are not valid
            process_type_schema( type , this.rpc_objects_lookup );
        }

        this.param_types = types;

    }


    return ( return_type ) {
        let class_name;

        if ( typeof return_type === "function" ){
            class_name = return_type.name;
            return_type = new return_type;
        }

        process_type_schema( return_type , this.rpc_objects_lookup , class_name );
        this.return_type = return_type;

    }


    function( callback ) {

        const func_name = callback.name;

        if ( func_name === "" ) {
            // refusing anomynous functions
            throw Error( "Zajil.function() expects named functions" );
        }

        
        if ( !this.param_types || !this.return_type )
            throw Error( "Zajil.function( ... )  requires you to specify types before calling it, using  Zajil.return( ... )  and  Zajil.params( ... ) ." );

        if ( this.rpc_callback_lookup[ func_name ] )
            throw Error( `${func_name} already exists as an rpc function` );


        const rpc_call_obj = new rpc_call;
        rpc_call_obj.callback = callback;
        rpc_call_obj.params = this.param_types;
        rpc_call_obj.return_type = this.return_type;

        this.rpc_callback_lookup[ func_name ] = rpc_call_obj;


        this.param_types = null;
        this.return_type = null;

    }


    export() {

        let rpc_functions = {};

        for( const func in this.rpc_callback_lookup ) {
            rpc_functions[ func ] = {
                ret: this.rpc_callback_lookup[func].return_type,
                params: this.rpc_callback_lookup[func].params
            };
        }

        return {
            RPCs : rpc_functions,
            objs : this.rpc_objects_lookup
        }

    }

    linkApp( app ) {

        app.use(express.json());
        
        let url = `/zajil-rpc/v1/${this.api_path}/schema`;
        
        app.get( url , (req, res) => {
            console.log( "sss" )
            res.json( this.export() );
        })

        app.post( `/zajil-rpc/v1/${this.api_path}/call-rpc` , (req, res) => {
            const call_data = JSON.parse(request.body);
            /**
             *  expected
             *      rpc:string -> function name
             *      params:[any] -> array of parameters
            **/
            if (  (!call_data.rpc) | (!call_data.params)  ) {
                res.status( 400 ).send("");
                return;
            }

            const call_schema = this.rpc_callback_lookup[ call_data.rpc ];
            const is_valid_type = validate_types(call_data.params, call_schema.params, this.rpc_objects_lookup);

            if (  (! call_schema)  |  (! is_valid_type)  ) {
                res.status( 400 ).send("");
                return;
            }

            try {
                res.json( {
                    return: call_schema.callback( ...call_data.params ),
                    status: "ok"
                } );

            } catch( e ) {
                res.json( {
                    return: null,
                    status: "bad",
                    err: e.toString()
                } );
            }
        })

    }


}



