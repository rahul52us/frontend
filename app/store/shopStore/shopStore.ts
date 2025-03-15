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
}

export const shopStore = new ShopStore();
