import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../providers/app-context"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setCurrentUser } = useAppContext(); // Access context to set current user
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://expense-tracker1-mbs9.onrender.com/api-v1/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Login failed. Please try again.");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setCurrentUser(data.user); // Update the current user in context
      navigate("/dashboard"); // Redirect user after login
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-primary mb-6">Login</h1>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-secondary mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-secondary focus:ring-secondary"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-secondary mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-secondary focus:ring-secondary"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-black py-2 rounded-md hover:bg-primary-dark transition-colors"
          >
            Login
          </button>
        </form>
        <h4 className="text-primary mt-6">Don't Have An Account?</h4>
        <Link
          to="/Register" 
          className="w-full bg-secondary text-black py-2 rounded-md hover:bg-secondary-white transition-colors mt-2 text-center"
        >
          Register Here
        </Link>
      </div>
    </div>
  );
}
