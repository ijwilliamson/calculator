const Button = (props) =>{

    const buttonAction = () =>{
        //Temp function, this can be removed once all buttons are
        //working and the call to this function replaced with the
        //callback function directly.
        
      if(props.function==="insert" ||
         props.function==="calculate" ||
         props.function==="process" ||
         props.function==="memory" ||
         props.function==="operator"){
        props.callback(props.value);
      }
    }
  
    const buttonStyle = () =>{
    //this is a temporary function used to disable buttons not
    //yet working.  It can be removed when no longer required
      let working = (!props.working) ? ' disabled' : ''
      let style = props.color + working
      return style
    }
  
    return (
      <button  onClick={()=>buttonAction()} className={buttonStyle()}>{props.children}</button>
    )
  }

  export default Button;