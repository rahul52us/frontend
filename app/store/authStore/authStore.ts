// stores/authStore.ts
import { makeAutoObservable } from "mobx";
import axios from "axios";
import { AUTH_TOKEN, BACKEND_URL, USER_SESSION_DATA } from "../../config/utils/variables";
import stores from "../stores";

interface Notification {
  title?: any;
  message: string;
  type?: any;
  placement?: string;
  action?: any;
  duration?: number;
  image?: string;
}

class AuthStore {
  user: any = null;
  token: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  notification: Notification | null = null;
  company: any = "67c7380f5e373d64c5b56fbe"

  constructor() {
    makeAutoObservable(this);
    axios.defaults.baseURL = BACKEND_URL
    axios.defaults.timeout = 0;
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

  changePassword = async (sendData: any) => {
    try {
      const { data } = await axios.post("/auth/change-password", { ...sendData, company: stores.auth.company });
      return data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    }
  };

  doLogout = () => {
    this.user = null;
    this.clearLocalStorage();
  };

  clearLocalStorage = () => {
    localStorage.removeItem(
      AUTH_TOKEN as string
    );
    sessionStorage.removeItem(USER_SESSION_DATA!);
  };

  openNotification = (data: {
    title: any;
    message: string;
    type?: string;
    placement?: string;
    action?: any;
    duration?: number;
    image?: string;
  }) => {
    this.notification = {
      title: data.title,
      message: data.message,
      type: data.type ? data.type : "success",
      placement: data.placement ? data.placement : "bottom",
      action: data.action ? data.action : null,
      image: data.image,
    };
  };

  closeNotication = () => {
    this.notification = null;
  };

  // Register user
  register = async (payload: any) => {
    this.isLoading = true;
    try {
      const response = await axios.post("/auth/admin/signup", payload);
      return response?.data?.data
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    } finally {
      this.isLoading = false;
    }
  };

  verifyRegisterOtp = async (payload: any) => {
    this.isLoading = true;
    try {
      const response = await axios.post("/auth/admin/signup/verify", payload);
      this.token = response?.data?.data?.authorization_token;

      if (this.token && typeof window !== "undefined") {
        localStorage.setItem(AUTH_TOKEN, this.token);
      }

      return response?.data?.data
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    } finally {
      this.isLoading = false;
    }
  };

  // Login user
  login = async (payload: any) => {
    this.isLoading = true;
    try {
      const response = await axios.post("/auth/login", payload);
      return response?.data?.data
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    } finally {
      this.isLoading = false;
    }
  };

  verifyLoginOtp = async (payload: any) => {
    this.isLoading = true;
    try {
      const response = await axios.post("/auth/login/verify", payload);
      this.token = response?.data?.data?.authorization_token;

      if (this.token && typeof window !== "undefined") {
        localStorage.setItem(AUTH_TOKEN, this.token);
        stores.cartStore.syncCart();
        await this.fetchUser();
      }

      return response?.data?.data
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
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

      const isSuperAdmin = this.user?.type === "superAdmin" || this.user?.role === "superAdmin" || (Array.isArray(this.user?.role) && this.user.role.includes("superAdmin"));
      if (!isSuperAdmin) {
        stores.cartStore.fetchCart();
      }
    } catch (err: any) {
      this.error = err?.response?.data?.message || "Failed to fetch user info.";
    }
  };

  getCompanyUsers = async (sendData: any = {}) => {
    try {
      const { data } = await axios.post(`auth/get/users`, {}, { params: { ...sendData } });
      return data.data?.map((item: any) => ({ user: { ...item } })) || [];
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    }
  };

  toggleLikeProduct = async (productId: string) => {
    try {
      const { data } = await axios.post("/user/like", { productId });

      if (this.user) {
        this.user.likedProducts = data.data.likedProducts;
      }

      return data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    }
  };

  fetchWishlist = async () => {
    try {
      const { data } = await axios.get("/user/wishlist");
      return data.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
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

    // Clear cart to prevent next user seeing previous user's items
    stores.cartStore.clearCart();
  };
}

export const authStore = new AuthStore();
