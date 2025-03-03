import { makeAutoObservable } from "mobx";
import axios from "axios";

class TestimonialStore {
  testimonialLayout = "table";

  testimonials = {
    data: [],
    currentPage: 1,
    hasMore: false,
    loading: true,
    hasFetch: false,
  };

  openTestimonialDrawer = {
    open: false,
  };

  constructor() {
    makeAutoObservable(this);
  }

  // Fetch Testimonials
  getTestimonials = async (sendData: { page: number }) => {
    this.testimonials.loading = true;
    try {
      const { data } = await axios.get(
        `/testimonial/get?page=${sendData.page}&limit=10`
      );
      this.testimonials.data = [...this.testimonials.data, ...data.data];
      this.testimonials.hasMore = data.data.length > 0;
      this.testimonials.hasFetch = true;
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
      const { data } = await axios.post(`/testimonial/create`, sendData);
      this.testimonials.data.unshift(data.data);
      return data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data);
    }
  };

  // Edit Testimonial
  editTestimonial = async (sendData: any, id: string) => {
    try {
      const { data } = await axios.put(`/testimonial/update`, sendData);
      const index = this.testimonials.data.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.testimonials.data.splice(index, 1, data.data);
      }
      return data;
    } catch (err: any) {
      return Promise.reject(err?.response?.data);
    }
  };

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
