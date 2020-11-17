import React from 'react';
import TextField from '@material-ui/core/TextField';


const TextInput = (props) => {
    return (
        <TextField 
        fullWidth={true}
        margin={"dense"}
        multline={props.multiline}
        label={props.label}
        value={props.value}
        type={props.type}
        onChange={props.onChange} />   
    )
}

export default TextInput;