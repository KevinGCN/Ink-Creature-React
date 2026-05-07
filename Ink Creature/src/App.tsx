import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Home } from "./components/home";
import './App.css'
import Login from "./components/login";
import { Register } from "./components/register";
import { Gallery } from "./components/gallery";
import { Information } from "./components/information";
import { Schedules } from "./components/schedules";
import { Workers } from "./components/workers";
import { Profile } from "./components/profile";

function App() {

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Gallery" element={<Gallery />} />
          <Route path="/Information" element={<Information />} />
          <Route path="/Schedules" element={<Schedules />} />
          <Route path="/Workers" element={<Workers />} />
          <Route path="/Profile" element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
