import React, { useEffect } from "react";
import UserDetails from "../../components/UserDetails";
import { User } from "../../components/FetchUser";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./index.css";

interface ProfileProps {
	user: User | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
	const navigate = useNavigate();
	const [cookies, , removeCookie] = useCookies(["user"]);

	useEffect(() => {
		document.title = "Profile - Avec";
	}, []);

	if (!user) {
		return <p>Sign in to view your profile.</p>;
	}

	const handleLogout = () => {
		removeCookie("user");
		navigate("/");
	};

	const handleDelete = async () => {
		const confirmed = window.confirm("Are you sure you want to delete this user?");
		if (!confirmed) {
			return;
		}
		try {
			const response = await fetch(`http://localhost:1337/api/v1/delete/user/${user._id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			await response.json();

			handleLogout();
		} catch (error) {
			console.error("Error deleting user:", error);
		}
	};

	console.log(user);
	return (
		<div>
			<h1>Profile</h1>
			<UserDetails user={user} />
			<p className="delete-p">
				<span onClick={() => handleDelete()} className="delete-user">
					Delete your account
				</span>
			</p>
		</div>
	);
};

export default Profile;
