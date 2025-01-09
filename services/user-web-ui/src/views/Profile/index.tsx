import React, { useEffect } from "react";
import UserDetails from "../../components/UserDetails";
import { User } from "../../components/FetchUser";

interface ProfileProps {
	user: User | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
	useEffect(() => {
		document.title = "Profile - Avec";
	}, []);

	if (!user) {
		return <p>Sign in to view your profile.</p>;
	}

	console.log(user);
	return (
		<div>
			<h1>Profile</h1>
			<UserDetails user={user} />
		</div>
	);
};

export default Profile;
