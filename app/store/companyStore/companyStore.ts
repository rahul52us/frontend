import { makeAutoObservable } from "mobx";
import axios from "axios";
import { authStore } from "../authStore/authStore";

class CompanyStores {
  therapist: any = {
    loading: false,
    data: [],
    page: 1
  }
  companyDetails: any = {}
  userSettings: any = {};
  userPreferences: any = {};
  isLoading: boolean = false;
  error: string | null = null;
  shopsCache: any = null;
  lastShopsPayload: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchCompanyDetails = async () => {
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

  updateCompanyDetails = async (payload: any) => {
    this.isLoading = true;
    try {
      const response = await axios.put(`/company/${payload._id}`, {
        ...payload,
        company: payload?._id
      });
      return response;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    } finally {
      this.isLoading = false;
    }
  };

  createCompany = async (payload: any) => {
    this.isLoading = true;
    try {
      const response = await axios.post("/company/create", payload);
      // Update local user type immediately if successful so UI reflects it
      if (authStore.user) {
        authStore.user.type = 'seller';
        authStore.user.company = response.data?.data?._id;
      }
      return response;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    } finally {
      this.isLoading = false;
    }
  };

  getPageContent = (name: string) => {
    if (Object.keys(this.companyDetails || {}).length) {
      const dt = this.companyDetails.details?.filter((it: any) => it.name === name)
      if (dt?.length > 0) {
        return dt[0]?.fields || {}
      }
      else {
        return {}
      }
    }
  }

  getCompanyDetails = async () => {
    if (!authStore.company) return;
    this.isLoading = true;
    try {
      const response = await axios.get(`/company/${authStore.company}`);
      this.companyDetails = response.data?.data
      return response;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    } finally {
      this.isLoading = false;
    }
  };

  getAllShops = async (payload: any, forceRefresh: boolean = false) => {
    const currentPayload = JSON.stringify(payload);

    if (!forceRefresh && this.shopsCache && this.lastShopsPayload === currentPayload) {
      return this.shopsCache;
    }

    this.isLoading = true;
    try {
      const response = await axios.post(`/company`, payload);
      this.shopsCache = response.data;
      this.lastShopsPayload = currentPayload;
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    } finally {
      this.isLoading = false;
    }
  };

  deleteShop = async (id: string) => {
    this.isLoading = true;
    try {
      const response = await axios.delete(`/company/${id}`);
      this.shopsCache = null; // Invalidate cache
      this.lastShopsPayload = null;
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    } finally {
      this.isLoading = false;
    }
  };

  updateShop = async (id: string, payload: any) => {
    this.isLoading = true;
    try {
      const response = await axios.put(`/company/${id}`, payload);
      this.shopsCache = null; // Invalidate cache
      this.lastShopsPayload = null;
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    } finally {
      this.isLoading = false;
    }
  };
}

export const CompanyStore = new CompanyStores();
