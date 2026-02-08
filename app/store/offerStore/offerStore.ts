import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

class OfferStore {
  offers: any[] = [];
  loading: boolean = false;
  offersCache: any = null;
  lastOffersPayload: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getAllOffers = async (params: any = {}, forceRefresh: boolean = false) => {
    const currentPayload = JSON.stringify(params);

    if (!forceRefresh && this.offersCache && this.lastOffersPayload === currentPayload) {
      runInAction(() => {
        this.offers = this.offersCache.data;
      });
      return this.offersCache;
    }

    this.loading = true;
    try {
      const response = await axios.get("/offer", { params });
      runInAction(() => {
        if (response.data.status === "success") {
          this.offers = response.data.data;
          this.offersCache = response.data;
          this.lastOffersPayload = currentPayload;
        }
      });
      return response.data;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Error fetching offers:", error);
      return error.response?.data || { status: "error", message: "Failed to fetch offers" };
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  createOffer = async (data: any) => {
    this.loading = true;
    try {
      const response = await axios.post("/offer", data);
      runInAction(() => {
        if (response.data.status === "success") {
          this.offersCache = null;
          this.lastOffersPayload = null;
        }
      });
      return response.data;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Error creating offer:", error);
      return error.response?.data || { status: "error", message: "Failed to create offer" };
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateOffer = async (id: string, data: any) => {
    this.loading = true;
    try {
      const response = await axios.put(`/offer/${id}`, data);
      runInAction(() => {
        if (response.data.status === "success") {
          this.offersCache = null;
          this.lastOffersPayload = null;
        }
      });
      return response.data;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Error updating offer:", error);
      return error.response?.data || { status: "error", message: "Failed to update offer" };
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteOffer = async (id: string) => {
    this.loading = true;
    try {
      const response = await axios.delete(`/offer/${id}`);
      runInAction(() => {
        if (response.data.status === "success") {
          this.offers = this.offers.filter((o) => o._id !== id && o.offerId !== id);
          this.offersCache = null;
          this.lastOffersPayload = null;
        }
      });
      return response.data;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error("Error deleting offer:", error);
      return error.response?.data || { status: "error", message: "Failed to delete offer" };
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}

const offerStore = new OfferStore();
export default offerStore;
