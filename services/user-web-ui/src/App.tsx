import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FetchUser, User } from "./components/FetchUser";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./views/Home";
import RideHistory from "./views/RideHistory";
import Profile from "./views/Profile";
import Payments from "./views/Payments";
import Login from "./views/Login";

function App() {
  const [cookies] = useCookies(["user"]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userCookie = cookies.user;
      if (userCookie?.email) {
        const fetchedUser = await FetchUser(userCookie.email);
        setUser(fetchedUser);
      }
    };

    fetchUserDetails();
  }, [cookies]);

  console.log(user);

  return (
    <Router>
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ride-history" element={<RideHistory />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
