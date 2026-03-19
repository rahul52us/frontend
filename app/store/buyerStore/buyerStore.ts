import { makeAutoObservable } from "mobx";
import axios from "axios";

class BuyerStore {
  constructor() {
    makeAutoObservable(this);
  }

  upsertBuyer = async (payload: any) => {
    try {
      const response = await axios.post("/buyer/upsert", payload);
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    }
  };

  listBuyerProfiles = async (payload: any) => {
    try {
      const response = await axios.post("/buyer", payload);
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    }
  };

  importBuyerContacts = async (payload: any) => {
    try {
      const response = await axios.post("/buyer/import-contacts", payload);
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    }
  };

  getBuyerProfile = async (id: string) => {
    try {
      const response = await axios.get(`/buyer/${id}`);
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    }
  };

  updateBuyerProfile = async (id: string, payload: any) => {
    try {
      const response = await axios.put(`/buyer/${id}`, payload);
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    }
  };

  deleteBuyerProfile = async (id: string) => {
    try {
      const response = await axios.delete(`/buyer/${id}`);
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    }
  };

  createBuyerLedgerEntry = async (profileId: string, payload: any) => {
    try {
      const response = await axios.post(`/buyer/${profileId}/ledger`, payload);
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    }
  };

  listBuyerLedgerEntries = async (profileId: string, payload: any) => {
    try {
      const response = await axios.post(`/buyer/${profileId}/ledger/list`, payload);
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    }
  };

  reverseBuyerLedgerEntry = async (profileId: string, entryId: string, payload?: any) => {
    try {
      const response = await axios.post(`/buyer/${profileId}/ledger/${entryId}/reverse`, payload || {});
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    }
  };

  createBuyerSaleRecord = async (profileId: string, payload: any) => {
    try {
      const response = await axios.post(`/buyer/${profileId}/sales`, payload);
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    }
  };

  listBuyerSaleRecords = async (profileId: string, payload: any) => {
    try {
      const response = await axios.post(`/buyer/${profileId}/sales/list`, payload);
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    }
  };

  postBuyerSaleRecordToLedger = async (profileId: string, saleId: string, payload?: any) => {
    try {
      const response = await axios.post(`/buyer/${profileId}/sales/${saleId}/post-ledger`, payload || {});
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    }
  };
}

const buyerStore = new BuyerStore();
export default buyerStore;
