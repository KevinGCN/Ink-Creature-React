import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { home } from "./components/home";
import './App.css'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<home />} />
      </Routes>
    </Router>
  )
}

export default App
