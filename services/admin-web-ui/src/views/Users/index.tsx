import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const Users: React.FC = () => {
	const [fetchedUsers, setFetchedUsers] = useState<any[]>([]);

	useEffect(() => {
		document.title = "Users - Fenix";

		const fetchUsers = async () => {
			try {
				const response = await fetch("http://localhost:1337/api/v1/get/all/users");
				const data = await response.json();
				setFetchedUsers(data);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};

		fetchUsers();
	}, []);

	const navigate = useNavigate();

	const displayUser = (user: string) => {
		navigate(`/user/${user}`);
	};

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
