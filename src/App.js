import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './Main/Dashboard';
import Case_details from './Component/Case_details';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/CaseDetails" element={<Case_details />} />
      </Routes>
    </Router>
  );
}

export default App;
