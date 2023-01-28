import React, {useState} from 'react'
import axios from "axios"

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialx = 2
const initialy = 2
const initialIndex = 4// the index the "B" is at

export default function AppFunctional(props) {
  const [state, setState ]= useState(
    {
      message: initialMessage,
      email: initialEmail,
      steps: initialSteps,
      x: initialx,
      y: initialy,
      index: initialIndex,
    }
  )
  // const state = initialState;
  const getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return {x:state.x,y:state.y}
  }
  const getCoord = (index) => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const coordinateObject = getXY();
    return `(${coordinateObject.x},${coordinateObject.y})`
  }

  const reset = () => {
    // Use this helper to reset all states to their initial values.
    setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
      x: initialx,
      y: initialy,
    })
  }

  const move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id;
    if(direction === "up"){
      if(state.index < 3){
        setState({...state, message:"You can't go up"})
      }else{
        const newIndex = state.index-3
        setState({...state, index:newIndex, steps:state.steps+1, message:"", y:state.y-1})
      }
    }

    if(direction === "down"){
      if(state.index >= 7 || state.index === 6){
        setState({...state, message:"You can't go down"})
      }else{
        const newIndex = state.index+3
        setState({...state, index:newIndex, steps:state.steps+1, message:"", y:state.y+1})
      }
    }

    if(direction === "right"){
      if(state.index === 2 || state.index === 5 || state.index === 8){
        setState({...state, message:"You can't go right"})
      }else{
        const newIndex = state.index+1
        setState({...state, index:newIndex, steps:state.steps+1, message:"", x:state.x+1})
      }
    }

    if(direction === "left"){
      if(state.index === 0 || state.index === 3 || state.index === 6){
        setState({...state, message:"You can't go left"})
      }else{
        const newIndex = state.index-1
        setState({...state, index:newIndex, steps:state.steps+1, message:"", x:state.x-1})
      }
    }
  }

  const onChange = (evt) => {
    // You will need this to update the value of the input.
    setState({...state, [evt.target.name]: evt.target.value})

  }

  const onSubmit = (evt) => {
    evt.preventDefault();
    axios.post("http://localhost:9000/api/result", {
      x: state.x, y: state.y, email: state.email, steps: state.steps
    })
      .then(res => {
        // console.log(res);
        if(state.email === "foo@bar.baz"){
          setState({...state, message:"foo@bar.baz failure #71"})
        }else{
          setState({x: state.x, y: state.y, email: "", steps:state.steps, message: res.data.message});
        }
        
      })
      .catch(err => {
        // console.log(err);
        setState({...state, message:err.response.data.message})
      })
      
    // setState({...state, email:""})
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
          <h3 id="coordinates">Coordinates {getCoord()}</h3>
          <h3 id="steps">{`You moved ${state.steps} time${state.steps!==1 ? "s": ""}`}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === state.index ? ' active' : ''}`}>
                {idx === state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={move}>LEFT</button>
          <button id="up" onClick={move}>UP</button>
          <button id="right" onClick={move}>RIGHT</button>
          <button id="down" onClick={move}>DOWN</button>
          <button id="reset" onClick={reset}>reset</button>
        </div>
        <form>
          <input id="email" type="email" name="email" value={state.email} placeholder="type email" onChange={onChange}></input>
          <input id="submit" type="submit" onClick={onSubmit}></input>
        </form>
    </div>
  )
}
