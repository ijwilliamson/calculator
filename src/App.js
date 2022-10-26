import { useState, useRef } from 'react';
import './App.css';
import buttonDefs from './buttonDefs';
import Button from './Button'
import  {
  atan2, chain, derivative, e, evaluate, log, pi, pow, round, sqrt
} from 'mathjs'

const App = () => {
  
  const [input, updateInput] = useState([])
  //TODO: this needs to be developed so that there is a state for
  //the display elements and a state for the calc elements.
  //Add an extra property to the buttonDefs which hold the calc
  //elements
  const [answer, updateAnswer] = useState("")
  
  let mathComplete = useRef(false);
  let userBack = useRef([])

  const [history, updateHistory] = useState([])
  const [memoryValue, updateMemoryValue] = useState(0)

  //Symbols as follows : 0-Memory 1-bin/hex/dec
  //                     2-history count 3-history position
  const [symbols, updateSymbols] = useState(["","dec",""])
  
// History methods

  
// Methods to pass for callback depending on button function

  const addToScreen = (value) =>{
    // handles insert function
    if(mathComplete.current){
      mathComplete.current = false;
      userBack.current = [value]
      updateInput(userBack.current)
      updateAnswer("")

    } else {
      
      let tempInput = [...userBack.current]
      userBack.current = tempInput.concat(value)
      updateInput(userBack.current)
      
    }

  }

  const operator = (value) =>{
    //handles operators by deciding if the answer should be added first

    if(mathComplete.current){
      calculate("ans") //simulate the answer button 
    }
    addToScreen(value)

  }

  const process = (value) =>{
    switch (value){
      case "clear":
        userBack.current = []
        updateInput(userBack.current);
        updateAnswer("");
        break;

      case "back":
        userBack.current = userBack.current.slice(0,userBack.current.length-1)
        updateInput(userBack.current)

        break;

      default:
        break;
    }
  }

  

  const memory = (value) => {
    console.log(value)
    switch (value) {
      case "mPlus": { 
        
        let converted = Number(userBack.current.join(''));

        if (isNaN(converted)){
          updateAnswer("Error . . .")
          console.log("Not a Number")

        } else{
          updateMemoryValue(memoryValue + converted)
          switchMemorySymbol(true);
          mathComplete.current = true;
          
          updateAnswer("")
        }
        return;
      }

      case "mSub": {
        let converted = Number(userBack.current.join(''));

        if (isNaN(converted)){
          updateAnswer("Error . . .")
          console.log("Not a Number")

        } else{
          updateMemoryValue(memoryValue - converted)
          switchMemorySymbol(true);
          mathComplete.current = true;
        }
        return;
      } 
        

      case "mRecal":
        addToScreen(memoryValue);
        return;

      case "mClear":
        updateMemoryValue(0);
        switchMemorySymbol(false)
        return;

      default:
        return;
    }
  }

  const calculate = (value) =>{
    // handles calculate function
   
    switch (value){
      case "equals":
        if(!userBack.current) break;
        //TODO need to add error handling to catch invalid math
        try {
          // TODO this is crude as it will not handle special elements
          // such as root power etc.  To be developed
          let joined = userBack.current.join('')
          let mathAnswer = evaluate(joined)
        updateAnswer(mathAnswer);   
        mathComplete.current = true
        updateHistory([...history, {input: userBack.current, answer: mathAnswer}])
        } catch (error) {
          updateAnswer("Error . . .")
          
        }
        break;

      case "ans":
        //Return the last answer to the input for use
        console.log("get answer")
        if (history.length>0){
          userBack.current = [history[history.length-1].answer.toString()]
          updateInput(userBack.current)
          updateAnswer("")
          mathComplete.current = false;
          
          console.log(`math complete : ${mathComplete.curent}`)
        }
        break;

      default:
        break;

    }

  }

  const selectCallback = (func) =>{
    //select the appropriate callback function for the
    //function type of the button.
            
      switch(func){
        case "insert":
          return addToScreen;
          
        case "calculate":
          return calculate;
         
        case "process":
          return process;

        case "memory":
          return memory;
        
        case "operator":
          return operator;

        default:
          return addToScreen;
          
      }
   
  }

  const symbolRow = () =>{
    //convert the array of symbols such as M and dec to JSX
    let htmlSymbols = symbols.map((symbol)=>{
        return <span>{symbol}</span>
    })
    return htmlSymbols
  }

  const switchMemorySymbol = (value) => {
    //if value does not contain a value then switch, otherwise set
    
    let tempSymbols = symbols;

    if(value===null){
      tempSymbols[0] = (memory[0] === "M") ? "" : "M"
      
    } else if(value===true) {
      tempSymbols[0] = "M"
    
    } else if(value===false) {
      tempSymbols[0] = ""
    }

    updateSymbols(tempSymbols)
  }

  const calcButtons = buttonDefs;
  //Generate an Array of button components from the buttonDefs Array
  let returnArray = calcButtons.map((button,id) =>{
    return (
      <Button key={id} color={button.color}
        function={button.function} value={button.value}
        callback={selectCallback(button.function)} working={button.working}>
          {button.label}
      </Button>
    )
  })

  //HTML return elemets
  return (
    <div className='app'>
      <div className='calculator'>
      <div className="background"/>
        <div className='screen'>
          <div className='symbols'>{symbolRow()}</div>
          <div className='input'>{input}</div>
          <div className='answer'>{answer}</div>
        </div>
        <div className='keyboard'>
          {returnArray}          
        </div>   
      </div>
    </div>
  );
}

export default App;
