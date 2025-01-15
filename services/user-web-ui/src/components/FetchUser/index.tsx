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
  balance: number;
}

const FetchUser = async (userEmail: string): Promise<User | null> => {
  try {
    const response = await fetch(`http://localhost:1337/get/user/email/${userEmail}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user: User = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export type { User };
export { FetchUser };
