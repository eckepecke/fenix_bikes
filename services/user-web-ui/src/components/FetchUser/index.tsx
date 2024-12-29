// Define the User type
interface User {
  _id: string;
  name: string;
  payment_method: string;
  password: string;
  email: string;
  banned: boolean;
  completed_trips: string[];
  user_id?: string;
}

// Fetch user data
const FetchUser = async (userId: string): Promise<User | null> => {
  try {
    const response = await fetch(`http://localhost:1337/get/all/users`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const users: User[] = await response.json();

    // Find the user with the matching ID
    return users.find(user => user._id === userId) || null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export type { User };
export { FetchUser };