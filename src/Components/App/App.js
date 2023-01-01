import './App.css';
import { Title } from '../Title/Title.js'
import { Panel } from '../Panel/Panel.js'

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      
      <Title />
      <div className="Board">
        <Panel />
        <Panel />
      </div>
      
    </div>
  );
}

export default App;