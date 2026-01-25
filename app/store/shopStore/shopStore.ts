import { makeAutoObservable } from "mobx";
import axios from "axios";
class ShopStore {
  shop: any = {
    loading: true,
    data: [],
    totalPages: 1
  }
  productsCache: any = null;
  lastProductsPayload: string | null = null;
  shopsCache: any = null;
  lastShopsPayload: string | null = null;
  allShopProductsCache: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  getAllShops = async (sendData: any, forceRefresh: boolean = false) => {
    const { page = 1 } = sendData;
    const currentPayload = JSON.stringify(sendData);

    if (!forceRefresh && this.shopsCache && this.lastShopsPayload === currentPayload) {
      const response = this.shopsCache;
      return response;
    }

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

      // Update Cache
      this.shopsCache = response;
      this.lastShopsPayload = currentPayload;

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

  getAllShopProducts = async (forceRefresh: boolean = false) => {
    if (!forceRefresh && this.allShopProductsCache) {
      return this.allShopProductsCache;
    }
    try {
      const response = await axios.get(`/product/allproducts`);
      this.allShopProductsCache = response.data;
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    } finally {
    }
  };

  getProductById = async (id: string) => {
    try {
      const response = await axios.get(`/product/${id}`);
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    }
  };

  getShopProducts = async (sendData: any, forceRefresh: boolean = false) => {
    const currentPayload = JSON.stringify(sendData);

    if (!forceRefresh && this.productsCache && this.lastProductsPayload === currentPayload) {
      return this.productsCache;
    }

    try {
      const response = await axios.post(`/product`, sendData);

      this.productsCache = response.data;
      this.lastProductsPayload = currentPayload;

      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    } finally {
    }
  };

  deleteProduct = async (id: string) => {
    try {
      const response = await axios.delete(`/product/delete/${id}`);
      this.productsCache = null; // Invalidate list cache
      this.lastProductsPayload = null;
      this.allShopProductsCache = null; // Invalidate home page products cache
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    }
  };

  updateProduct = async (id: string, sendData: any) => {
    try {
      const response = await axios.put(`/product/update/${id}`, sendData);
      this.productsCache = null; // Invalidate list cache
      this.lastProductsPayload = null;
      this.allShopProductsCache = null; // Invalidate home page products cache
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    }
  };

  searchGlobalProducts = async (sendData: any) => {
    try {
      const response = await axios.post(`/product/search`, sendData);
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    }
  };

  getAllProducts = async (sendData: any, forceRefresh: boolean = false) => {
    const currentPayload = JSON.stringify(sendData);

    if (!forceRefresh && this.productsCache && this.lastProductsPayload === currentPayload) {
      return this.productsCache;
    }

    this.shop.loading = true;
    try {
      const response = await axios.post(`/product`, sendData);
      this.productsCache = response.data;
      this.lastProductsPayload = currentPayload;
      return response.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err.message);
    } finally {
      this.shop.loading = false;
    }
  };

}

export const shopStore = new ShopStore();
