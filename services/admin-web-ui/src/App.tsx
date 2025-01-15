import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AddBike from "./components/AddBike";
import Bike from "./components/Bike";
import City from "./components/City";
import Map from "./components/Map";
import Trip from "./components/Trip";
import Home from "./views/Home";
import Bikes from "./views/Bikes";
import Cities from "./views/Cities";
import Maps from "./views/Maps";
import Users from "./views/Users";
import UserDetails from "./views/UserDetails";
import Login from "./views/Login";
import Signup from "./views/Signup";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/bikes" element={<PrivateRoute><Bikes /></PrivateRoute>} />
          <Route path="/bikes/add" element={<PrivateRoute><AddBike /></PrivateRoute>} />
          <Route path="/bike/:bike" element={<PrivateRoute><Bike /></PrivateRoute>} />
          <Route path="/cities" element={<PrivateRoute><Cities /></PrivateRoute>} />
          <Route path="/city/:city" element={<PrivateRoute><City /></PrivateRoute>} />
          <Route path="/maps" element={<PrivateRoute><Maps /></PrivateRoute>} />
          <Route path="/map/:city" element={<PrivateRoute><Map /></PrivateRoute>} />
          <Route path="/trip/:trip" element={<PrivateRoute><Trip /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
          <Route path="/user/:userId" element={<PrivateRoute><UserDetails /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<PrivateRoute><Home /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;