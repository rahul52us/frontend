import { makeAutoObservable } from "mobx";
import axios from "axios";
import { authStore } from "../authStore/authStore";

class TestimonialStore {
  testimonialLayout = "table";

  testimonials = {
    data: [],
    totalPages: 1,
    loading : false
  };

  openTestimonialDrawer = {
    open: false,
  };

  constructor() {
    makeAutoObservable(this);
  }

  // Fetch Testimonials

  getTestimonials = async (sendData: { page: number, search: string }) => {
    this.testimonials.loading = true;
    try {
      const searchQuery = sendData.search ? `&search=${encodeURIComponent(sendData.search)}` : '';
      const { data } = await axios.get(
        `/testimonial/get?page=${sendData.page}&limit=10${searchQuery}`
      );
      this.testimonials.data = data?.data || [];
      this.testimonials.totalPages = data?.totalPages || 0;
      return data.data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data || err);
    } finally {
      this.testimonials.loading = false;
    }
  };


  // Delete Testimonial
  deleteTestimonial = async (sendData: { id: string }) => {
    try {
      const { data } = await axios.delete(`/testimonial/delete/${sendData.id}`);
      this.testimonials.data = this.testimonials.data.filter(
        (item) => item.id !== sendData.id
      );
      return data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data);
    }
  };

  // Create Testimonial
  createTestimonial = async (sendData: any) => {
    try {
      const { data } = await axios.post(`/testimonial/create`, {
        ...sendData,
        company: authStore.company,
      });
      this.testimonials.data.unshift(data.data);
      return data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data);
    }
  };

  // Edit Testimonial
  updateTestimonial = async (id : any,sendData : any) => {
    try {
      const { data } = await axios.put(`testimonial/${id}`, sendData);
      return data;
    } catch (err: any) {
      return Promise.reject(err?.response || err);
    }
  }

  // Download Testimonial List
  downloadTestimonialList = async (sendData: any) => {
    try {
      const response = await axios.post(
        "/testimonial/download/list",
        sendData,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "testimonials.xlsx");
      document.body.appendChild(link);
      link.click();
      return {
        data: "Testimonial list downloaded successfully",
      };
    } catch (err: any) {
      return Promise.reject(err);
    }
  };

  // Toggle Testimonial Drawer
  setOpenTestimonialDrawer = () => {
    this.openTestimonialDrawer.open = !this.openTestimonialDrawer.open;
  };

  // Toggle Layout (Table/Grid)
  setTestimonialLayout = () => {
    this.testimonialLayout =
      this.testimonialLayout === "table" ? "grid" : "table";
  };
}

export const testimonialStore = new TestimonialStore();
