import { createContext, useContext, useEffect, useState } from "react";
import fetchCurrentUser from "./api";

const AppContext = createContext(null);

function AppContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrentUser()
      .then((data) => {
        setCurrentUser(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, []);

  // Function to fetch user projects (if needed)
  const fetchUserProjects = async () => {
    try {
      const projects = await fetchUserProjectsFromAPI(); // Replace with your API call
      setUserProjects(projects);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userProjects,
        setUserProjects,
        isLoading,
        error,
        fetchUserProjects,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

const useAppContext = () => useContext(AppContext);

export { useAppContext, AppContextProvider };