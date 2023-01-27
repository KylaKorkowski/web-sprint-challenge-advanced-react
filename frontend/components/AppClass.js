import React from 'react'
import axios from "axios"

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialx = 2// the index the "B" is at
const initialy = 2
const initialIndex = 4

const initialState = {
  message: initialMessage,
  email: initialEmail,
  steps: initialSteps,
  x: initialx,
  y: initialy,
  index: initialIndex,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  state = initialState;
  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    return {x:this.state.x, y:this.state.y}
  }
  getCoord = (index) => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const coordinateObject = this.getXY();
    return `(${coordinateObject.x},${coordinateObject.y})`
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
      x: initialx,
      y: initialy,
    })
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id;
    if(direction === "up"){
      if(this.state.index < 3){
        this.setState({...this.state, message:"You can't go up"})
      }else{
        const newIndex = this.state.index-3
        this.setState({...this.state, index:newIndex, steps:this.state.steps+1, message:"", y:this.state.y-1})
      }
    }

    if(direction === "down"){
      if(this.state.index >= 7 || this.state.index === 6){
        this.setState({...this.state, message:"You can't go down"})
      }else{
        const newIndex = this.state.index+3
        this.setState({...this.state, index:newIndex, steps:this.state.steps+1, message:"", y:this.state.y+1})
      }
    }

    if(direction === "right"){
      if(this.state.index === 2 || this.state.index === 5 || this.state.index === 8){
        this.setState({...this.state, message:"You can't go right"})
      }else{
        const newIndex = this.state.index+1
        this.setState({...this.state, index:newIndex, steps:this.state.steps+1, message:"", x:this.state.x+1})
      }
    }

    if(direction === "left"){
      if(this.state.index === 0 || this.state.index === 3 || this.state.index === 6){
        this.setState({...this.state, message:"You can't go left"})
      }else{
        const newIndex = this.state.index-1
        this.setState({...this.state, index:newIndex, steps:this.state.steps+1, message:"", x:this.state.x-1})
      }
    }
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({...this.state, [evt.target.name]: evt.target.value})

  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    axios.post("http://localhost:9000/api/result", {
      x: this.state.x, y: this.state.y, email: this.state.email, steps: this.state.steps
    })
      .then(res => {
        console.log(res);
        this.setState({...this.state, message:res.data.message})

      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    const { className } = this.props
    console.log(this.state);
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates {this.getCoord()}</h3>
          <h3 id="steps">{`You moved ${this.state.steps} time${this.state.steps!==1 ? "s": ""}`}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form>
          <input id="email" type="email" name="email" value={this.state.email} placeholder="type email" onChange={this.onChange}></input>
          <input id="submit" type="submit" onClick={this.onSubmit}></input>
        </form>
      </div>
    )
  }
}
