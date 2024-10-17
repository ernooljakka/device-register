import { BrowserRouter as Router, Routes, Route,} from "react-router-dom";
import './styles/app.css';
import RegisterView from './views/device_register_view';
import DeviceInfoView from './views/device_info_view';
import EventView from './views/event_view';
import MoveView from './views/move_view';
import AdminView from "./views/admin_view"; // Assuming this will exist soon as well.

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/move/:id" element={<MoveView />} />
          <Route path="/" element={<RegisterView/>} />
          <Route path="/events" element={<EventView/>} />
          <Route path="/devices/:id" element={<DeviceInfoView/>} />
          <Route path="/admin" element={<AdminView/>} /> 
        </Routes>
      </Router>
  );
}

export default App;