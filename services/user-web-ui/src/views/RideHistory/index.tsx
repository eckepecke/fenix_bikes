import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { FetchUser, User } from "../../components/FetchUser";
import CompletedTrips from "../../components/CompletedTrips";

const RideHistory: React.FC = () => {
  const [cookies] = useCookies(["user"]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    document.title = "Ride History - Avec";

    const getUser = async () => {
      if (cookies.user?.email) {
        const fetchedUser = await FetchUser(cookies.user.email);
        setUser(fetchedUser);
      }
    };

    getUser();
  }, [cookies]);

  return (
    <div>
      <h1>Ride History</h1>
      <p>Overview of your past rides.</p>
      <CompletedTrips user={user} />
    </div>
  );
};

export default RideHistory;
