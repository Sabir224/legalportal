import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Dashboard from "./Main/Dashboard";
import Case_details from "./Component/Case_details";
import SignIn from "./Main/Pages/SignIn";
import SignUp_Screen from "./Main/Pages/SignUp_Screen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/Dashboards" element={<Dashboard />} />
        <Route path="/CaseDetails" element={<Case_details />} />
        <Route path="/SignUp" element={<SignUp_Screen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
