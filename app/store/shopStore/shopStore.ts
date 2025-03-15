import { makeAutoObservable } from "mobx";
import axios from "axios";
class ShopStore {
  shop: any = {
    loading : false,
    data : [],
    page : 1
  }

  constructor() {
    makeAutoObservable(this);
  }

  getAllShops = async (sendData : any) => {
    this.shop.loading = true;
    try {
      const response = await axios.post(`/company`,sendData);
      this.shop.data = response.data?.data
      return response;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    } finally {
      this.shop.loading = false;
    }
  };

  getSingleShop = async (sendData : any) => {
    try {
      const response = await axios.get(`/company/${sendData.title}`);
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    } finally {
    }
  };

}

export const shopStore = new ShopStore();
