import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './styles/app.css';
import RegisterView from './views/device_register_view';
import DeviceInfoView from './views/device_info_view';
import EventView from './views/event_view';
import MoveView from './views/move_view';
import AdminView from "./views/admin_view"; // Assuming this will exist soon as well.
import LoginView from "./views/login_view";
import AddView from "./views/add_view";
import Device_manager_view from "./views/device_manager_view";
import EditView from "./views/edit_view";
import Class_view from "./views/class_view";
import { useEffect, useState } from "react";
import { isJwtValid } from "./utils/jwt_utils";

function App() {
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const validateToken = () => {
      isJwtValid(localStorage.getItem("access_token"), true);  // eslint-disable-line no-undef
      setValidated(true);
    };
    validateToken();
  }, []);
  if (!validated) {
    return <div>Loading...</div>;
  }

  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<RegisterView />} />
        <Route path="/events" element={<EventView />} />
        <Route path="/devices/:id" element={<DeviceInfoView />} />
        <Route path="/devices/:id/move" element={<MoveView />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/add" element={<AddView />} />
        <Route path="/devices/:id/edit" element={<EditView />} />
        <Route path="/admin/manager" element={<Device_manager_view />} />
        <Route path="/admin/classes" element={<Class_view />} />
      </Routes>
    </Router>
  );
}

export default App;
