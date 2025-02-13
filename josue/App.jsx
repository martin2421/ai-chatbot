import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StateMachine from './StateMachine'

console.log(process.env)

function App() {

  StateMachine();
  
  return (
        <div>
          <div id="chat-circle">
            <div className="chef" id="chef">
              <div className="chef-icon">👨‍🍳</div>
              <div className="pan"></div>
              <div className="help-text">NEED HELP??</div>
            </div>
          </div>

          <div className="chat-box">
            <div className="chat-box-header">
              <span className="chat-box-toggle"><button className="material-icons">&times;</button></span>

              <p>Stir Food Chatbot</p>
              <button id="clearHistoryButton">&#x27f3;</button>

            </div>
            <div className="chat-box-body">
              <div className="chat-logs">
                <div id="messages"></div>
                <div id="button" className="buttons"></div>
              </div>
            </div>
          </div>
        </div>
  );
}

export default App;
