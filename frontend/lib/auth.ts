import api from "./api";

export interface LoginCredentials {
  username: string;
  password: string;
}

export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await api.post("/api/auth/login", credentials);
    const { token } = response.data;
    localStorage.setItem("token", token);
    return true;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const verifyToken = async () => {
  try {
    await api.get("/api/auth/verify");
    return true;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
};
