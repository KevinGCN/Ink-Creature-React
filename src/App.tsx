import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./services/auth";
import { Navbar } from "./components/navbar";
import { Lobby } from "./components/lobby";
import { Profile } from "./components/profile";
import { Gallery } from "./components/gallery";
import './App.css'
import { Workers } from "./components/workers";
import { Information } from "./components/information";
import { Schedules } from "./components/schedules";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/info" element={<Information />} />
          <Route path="/schedules" element={<Schedules />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App