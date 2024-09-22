import './styles/app.css';
import MoveView from './views/move_view';
import RegisterView from './views/device_register_view'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <div className="App">
        <MoveView/>
    </div>
  );
}

export default App;
