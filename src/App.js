import Main from "./components/Main";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import Settings from "./components/Settings";
import ForgotPassword from "./components/ForgotPassword";
import "./css/general/form.css"


function App() {
  return (
    <AuthProvider>
    <Router basename="/todo-app-react">
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<PrivateRoute><Main /></PrivateRoute>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        </Route>
      </Routes>
    </Router></AuthProvider>
  );
}

export default App;
