import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Users: React.FC = () => {
	useEffect(() => {
		document.title = "Users - Avec";
	}, []);

	const navigate = useNavigate();

	const displayUser = (user: string) => {
		navigate(`/user/${user}`);
	};

	const fetchedUsers = [
		{
			_id: "676529d83fcc9576927e5c74",
			name: "August Levinson",
			payment_method: "prepaid",
			password: "1234",
			email: "augustlevinson@gmail.com",
			banned: false,
			completed_trips: [],
		},
		{
			_id: "6765617d4cd3ac975e5ca6fd",
			name: "Test User",
			payment_method: "prepaid",
			password: "1234",
			email: "test@email.se",
			banned: false,
			completed_trips: ["T0013", "T0016", "T0017"],
			user_id: "U0011",
		},
	];

	return (
		<div>
			<h1>Users</h1>
			<ul className="user-list">
				{fetchedUsers.map((user, index) => (
					<li
						key={user._id}
						onClick={() => displayUser(user._id)}
						className={index === fetchedUsers.length - 1 ? "li-last-user" : ""}>
						{user.name}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Users;
