import { makeAutoObservable } from "mobx";
import axios from "axios";
import { authStore } from "../authStore/authStore";
class UserStore {
  therapist: any = {
    loading : false,
    data : [],
    totalPages : 1
  }
  userSettings: any = {};
  userPreferences: any = {};
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchUserSettings = async () => {
    this.isLoading = true;
    try {
      const response = await axios.get("/user/settings");

      this.userSettings = response.data?.settings || {};
    } catch (err: any) {
      this.error = err?.response?.data?.message || "Failed to fetch settings.";
      throw err;
    } finally {
      this.isLoading = false;
    }
  };

  createUser = async (payload: any) => {
    this.isLoading = true;
    try {
      const response = await axios.post("/user/create", {
        ...payload,
        company: authStore.company,
      });
      return response;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    } finally {
      this.isLoading = false;
    }
  };

  getAllUsers = async (payload: any) => {
    this.therapist.loading = true;
    try {
      const response : any = await axios.post("/user", {
        ...payload,
        company: authStore.company,
      });
      this.therapist.data = response?.data?.data?.data || []
      this.therapist.totalPages = response?.data?.data?.totalPages || 1
      return response;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    } finally {
      this.therapist.loading = false;
    }
  };


  updateUserSettings = async (settings: any) => {
    this.isLoading = true;
    try {
      const response = await axios.put("/user/settings", settings);

      this.userSettings = response.data?.settings || {};
    } catch (err: any) {
      this.error = err?.response?.data?.message || "Failed to update settings.";
      throw err;
    } finally {
      this.isLoading = false;
    }
  };

  // Update user preferences
  updateUserPreferences = async (preferences: any) => {
    this.isLoading = true;
    try {
      const response = await axios.put("/user/preferences", preferences);

      this.userPreferences = response.data?.preferences || {};
    } catch (err: any) {
      this.error =
        err?.response?.data?.message || "Failed to update preferences.";
      throw err;
    } finally {
      this.isLoading = false;
    }
  };
}

export const userStore = new UserStore();
