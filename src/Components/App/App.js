import './App.css';
//import { Title } from '../Title/Title.js'
import { Board } from '../Board/Board';
import { Sidebar } from '../Sidebar/Sidebar';

function App() {
  return (
        <div className="App">
            {/* <Title /> */}
            <Sidebar />
            <Board />
        </div>
    );
}
export default App;
