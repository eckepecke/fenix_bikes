import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./index.css";

interface UserDetails {
    _id: string;
    name: string;
    email: string;
    user_id: string;
    completed_trips: string[];
    banned: boolean;
    // Add other user properties here
}

const UserDetails: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchUser = async () => {
        try {
            const response = await fetch(`http://localhost:1337/get/user/id/${userId}`);
            const data = await response.json();
            console.log("Fetched user data:", data); // Debugging information
            setUser(data);
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId]);

    const changeBanStatus = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:1337/edit/user/ban/change/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    banned: !user?.banned,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await response.json();
            console.log("Ban status changed"); // Debugging information
            await fetchUser(); // Fetch the updated user data
        } catch (error) {
            console.error("Error changing ban status:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>No user found</div>;
    }

    return (
        <div>
            <h1>User Details</h1>
            <p>
                <strong>Name:</strong> {user.name}
            </p>
            <p>
                <strong>Email:</strong> {user.email}
            </p>
            <p>
                <strong>User ID:</strong> {user.user_id}
            </p>
            <p>
                <strong>ID:</strong> {user._id}
            </p>
            <p><strong>Completed Trips:</strong>
                {user.completed_trips && user.completed_trips.length > 0 ? (
                  user.completed_trips.map((tripId) => (
                    <span key={tripId}> {tripId} |</span>
                  ))
                ) : (
                  <span> None</span>
                )}
            </p>
            <p className="ban-status">
                {user.banned ? "User is currently banned – " : "User is not banned – "}
                {user.banned ? (
                    <span onClick={() => changeBanStatus()} className="ban-user">
                        (Lift ban)
                    </span>
                ) : (
                    <span onClick={() => changeBanStatus()} className="ban-user">
                        Ban user
                    </span>
                )}
            </p>
            {/* Om vi vill ha hard delete */}
            {/* <p className="delete-p"><span onClick={() => changeBanStatus()} className="delete-user">Delete user</span></p> */}
        </div>
    );
};

export default UserDetails;
