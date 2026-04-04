import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/pages/Auth/Login";
import Register from "./components/pages/Auth/Register";
import Game from "./components/pages/Game/Game";
import Rooms from "./components/pages/Rooms/GameRoomList";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/game/:roomId" element={<Game />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;