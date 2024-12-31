import React from "react";
import { User } from "../FetchUser";

interface UserDetailsProps {
    user: User;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
    return (
        <div>
            <p>
                <strong>Name:</strong> {user.name}
            </p>
            <p>
                <strong>Email:</strong> {user.email}
            </p>
            <p>
                <strong>Payment Method:</strong> {user.payment_method}
            </p>
            {/* <p>
                <strong>Completed Trips:</strong>{" "}
                {user.completed_trips.length > 0 ? user.completed_trips.join(", ") : "No trips completed"}
            </p> */}
        </div>
    );
};

export default UserDetails;