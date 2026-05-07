import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./services/auth";
import { Navbar } from "./components/navbar";
import { Lobby } from "./components/lobby";
import { Home } from "./components/home";
import { Profile } from "./components/profile";
import { Gallery } from "./components/gallery";
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App