


let obj_counter = 0;
const getAnonymousObjectName = () => {
    return `untitled_obj_${obj_counter++}`;
}







function check_if_class( value ) {
    return value.constructor.toString().substring(0, 5) === 'class'
}




// returns are used for recursion
// obj_name is used for recursion too
export function process_type_schema( type_schema , rpc_objects_lookup , obj_name ) {

    if ( type_schema === "str" ) {

        return "str";

    } else if ( type_schema === "flt" ) {

        return "flt";

    } else if ( type_schema === "int" ) {

        return "int";

    } else if ( type_schema === "any" ) {
        // used for untyped object to be converted into regular JSON which supports no schema
        return "any";

    } else if ( type_schema[0] === "@" ) {
    
        return "@"+process_type_schema( type_schema.substring(1) , rpc_objects_lookup );
        
    } else if ( typeof(type_schema) === "object" ) {

        if ( type_schema instanceof Array ) {
            throw Error( "you should not use [...] instead you should use array( <type> )" );
        }
        
        // regular objects
        let obj_definition = {};

        /* name objects with no names */
        obj_name = obj_name===undefined? getAnonymousObjectName() : obj_name;

        for( let key in type_schema ) {
            obj_definition[ key ] = process_type_schema( type_schema[key] , rpc_objects_lookup );
        }

        rpc_objects_lookup[ obj_name ] = obj_definition;
        return "$"+String(obj_name);

    } else if ( typeof(type_schema) === "function" ) {

        // type_schema must be a class
        
        const class_name = type_schema.name;
        const obj_schema = new type_schema;
        if( rpc_objects_lookup[ class_name ] ) {
            return "$"+class_name
        }
        
        return process_type_schema( obj_schema , rpc_objects_lookup , class_name );

    } else {
        throw Error( `${type_schema} is a not supported type.` );
    }

}





export function validate_types( value , type_schema , rpc_objects_lookup ) {

    if ( type_schema[0] === "@" ) {
        let state = value instanceof Array;
        let array_type = type_schema.substring( 1 );

        for (const item of value) {
            state = state && validate_types( item , array_type );
            if ( !state ) return false;
        }

        return true

    } else if ( type_schema[0] === "$" ) {

        let obj_name = type_schema.substring(1);
        let obj_type_schema = rpc_objects_lookup[ obj_name ];
        if ( !obj_type_schema ) return false; 

        //comparing keys
        let schema_keys = Object.keys(obj_type_schema);
        let value_keys = Object.keys(value);

        if ( schema_keys.length !== value_keys.length ) return false;

        for ( let i=0 ; i<value_keys.length ; i++ ) {
            if(  !validate_types( value_keys[i] ,  schema_keys[i] )  ) {
                return false;
            }
        }
        return true;

    } else if ( type_schema === "str" ) {
        return typeof value === "string";

    } else if ( type_schema === "int" ) {
        return typeof value === "number" && Number.isSafeInteger(value);

    } else if ( type_schema === "flt" ) {
        return typeof value === "number" && Number.isFinite(value);
        
    } else if ( type_schema === "any" ) {
        return true;

    } else {
        throw Error( `${typeof(value)} is not supported type.` )
    }

}



