import { makeAutoObservable } from "mobx";
import axios from "axios";
import { authStore } from "../authStore/authStore";
class CompanyStores {
  therapist: any = {
    loading : false,
    data : [],
    page : 1
  }
  companyDetails: any = {}
  userSettings: any = {};
  userPreferences: any = {};
  isLoading: boolean = false;
  error: string | null = null;

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
      const response = await axios.post("/company/update", {
        ...payload,
        company: authStore.company
      });
      return response;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    } finally {
      this.isLoading = false;
    }
  };

  getPageContent = (name : string) => {
    if(Object.keys(this.companyDetails || {}).length){
      const dt = this.companyDetails.details?.filter((it : any) => it.name === name)
      if(dt?.length > 0){
        return dt[0]?.fields || {}
      }
      else {
        return {}
      }
    }
  }

  getCompanyDetails = async () => {
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

}

export const CompanyStore = new CompanyStores();
