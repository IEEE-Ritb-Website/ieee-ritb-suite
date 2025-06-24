import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Chapters from "./pages/Chapters";
import Chapter from "./pages/Chapter";
import StudentBranch from "./pages/SB";
import Gallery from "./pages/Gallery";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chapters" element={<Chapters />} />
        <Route path="/chapters/:id" element={<Chapter />} /> {/* Dynamic */}
        <Route path="/student-branch" element={<StudentBranch />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
}

export default App;

