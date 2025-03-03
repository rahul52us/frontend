// stores/authStore.ts
import { makeAutoObservable } from "mobx";
import axios from "axios";
import { AUTH_TOKEN, BACKEND_URL } from "../../config/utils/variables";

interface Notification {
  title?: any;
  message: string;
  type?: any;
  placement?: string;
  action?: any;
  duration?:number
}

class AuthStore {
  user: any = null;
  token: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  notification: Notification | null = null;
  company: any = "65f65a70fbe7ae65d05dac64"

  constructor() {
    makeAutoObservable(this);
    axios.defaults.baseURL = BACKEND_URL
    axios.defaults.timeout = 10000;
    axios.defaults.headers["Content-Type"] = "application/json";

    // Attach token automatically for all requests
    axios.interceptors.request.use(
      (config) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem(AUTH_TOKEN);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          this.logout(); // Logout on 401
        }
        return Promise.reject(error);
      }
    );

    if (typeof window !== "undefined") {
      this.initializeUser();
    }
  }

  // Initialize User Session
  initializeUser = async () => {
    if (typeof window !== "undefined") {  // ✅ Prevent SSR errors
      const savedToken = localStorage.getItem(AUTH_TOKEN);
      if (savedToken) {
        this.token = savedToken;
        await this.fetchUser();
      }
    }
  };

  openNotification = (data: {
    title: any;
    message: string;
    type?: string;
    placement?: string;
    action?: any;
    duration?:number
  }) => {
    this.notification = {
      title: data.title,
      message: data.message,
      type: data.type ? data.type : "success",
      placement: data.placement ? data.placement : "bottom",
      action: data.action ? data.action : null,
    };
  };

  closeNotication = () => {
    this.notification = null;
  };

  // Register user
  register = async (email: string, password: string) => {
    this.isLoading = true;
    try {
      const response = await axios.post("/auth/register", { email, password });
      this.token = response.data.token;

      if (typeof window !== "undefined") {  // ✅ Prevent SSR issues
        localStorage.setItem("META", this.token);
      }

      await this.fetchUser();
    } catch (err: any) {
      this.error = err?.response?.data?.message || "Registration failed.";
    } finally {
      this.isLoading = false;
    }
  };

  // Login user
  login = async (payload: any) => {
    this.isLoading = true;
    try {
      const response = await axios.post("/auth/login", payload);
      this.token = response?.data?.data?.authorization_token;

      if (this.token && typeof window !== "undefined") {
        localStorage.setItem(AUTH_TOKEN, this.token);
      }

      await this.fetchUser();
      return response?.data
    } catch (err: any) {
      this.error = err?.response?.data?.message || "Login failed.";
    } finally {
      this.isLoading = false;
    }
  };

  // Fetch User Info
  fetchUser = async () => {
    if (!this.token) return;

    try {
      const response = await axios.post("/auth/me", {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      this.user = response.data?.data;
      this.company = this.user?.company
    } catch (err: any) {
      this.error = err?.response?.data?.message || "Failed to fetch user info.";
    }
  };

  // Logout user
  logout = () => {
    this.token = null;
    this.user = null;
    this.error = null;

    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN);
    }
  };
}

export const authStore = new AuthStore();
