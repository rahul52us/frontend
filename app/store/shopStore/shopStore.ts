import { makeAutoObservable } from "mobx";
import axios from "axios";
class ShopStore {
  shop: any = {
    loading: true,
    data: [],
    totalPages: 1
  }

  constructor() {
    makeAutoObservable(this);
  }

  getAllShops = async (sendData: any) => {
    const { page = 1 } = sendData;
    this.shop.loading = true;

    try {
      const response = await axios.post(`/company`, sendData);
      const newShops = response.data?.data?.data || [];

      if (page === 1) {
        this.shop.data = newShops;
      } else {
        this.shop.data = [...(this.shop.data || []), ...newShops];
      }

      this.shop.totalPages = response?.data?.data?.totalPages || 1;
      this.shop.totalCount = response?.data?.data?.total || 0;
      this.shop.currentPage = page;

      return response;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    } finally {
      this.shop.loading = false;
    }
  };


  getSingleShop = async (sendData: any) => {
    try {
      const response = await axios.get(`/company/${sendData.title}`);
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    } finally {
    }
  };

  getShopProducts = async (sendData: any) => {
    try {
      const response = await axios.post(`/product`, sendData);
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    } finally {
    }
  };

  deleteProduct = async (id: string) => {
    try {
      const response = await axios.delete(`/product/delete/${id}`);
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    }
  };

  updateProduct = async (id: string, sendData: any) => {
    try {
      const response = await axios.put(`/product/update/${id}`, sendData);
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    }
  };

}

export const shopStore = new ShopStore();
