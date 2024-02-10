import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { authenticate } from "../services/auth";
import { useToast } from "@chakra-ui/react";

interface Children {
  children: React.ReactNode;
}

interface ToastOptions {
  title: string;
  description?: string;
  status: "info" | "warning" | "success" | "error";
  duration?: number;
  isClosable?: boolean;
}

interface User {
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  showToast: (options: ToastOptions) => void;
}

const defaultContextValue: AuthContextType = {
  user: null,
  login: async () => {},
  logout: () => {},
  loading: false,
  showToast: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider = ({ children }: Children) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await authenticate(email, password);
      setUser(userData);
      navigate("/profile");
      showToast({
        title: "Logged in successfully",
        status: "success",
      });
    } catch (error) {
      console.error(error);
      showToast({
        title: "Login failed",
        description: "Check your credentials and try again.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const register = async (userDetails: {
    email: string;
    password: string;
    [key: string]: any;
  }) => {
    setLoading(true);
    try {
      const userData = await register(userDetails);
      setUser(userData); // Assuming your registration process also logs the user in
      showToast({
        title: "Registration Successful",
        description: "Your account has been created.",
        status: "success",
      });
      navigate("/profile"); // Adjust as necessary
    } catch (error) {
      showToast({
        title: "Registration Failed",
        description:
          (error as Error).message ||
          "An unexpected error occurred during registration.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const showToast = (options: ToastOptions) => {
    toast({
      position: "top",
      ...options,
    });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      register,
      loading,
      showToast,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value as any}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
