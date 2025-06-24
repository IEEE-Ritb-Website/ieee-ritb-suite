import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chapters from "./Pages/Chapters";
import Chapter from "./Pages/Chapter";
import StudentBranch from "./Pages/SB";
import Gallery from "./Pages/Gallery";

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
