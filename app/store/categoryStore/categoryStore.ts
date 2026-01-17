import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

class CategoryStore {
    categories: any[] = [];
    loading: boolean = false;
    totalCategories: number = 0;

    constructor() {
        makeAutoObservable(this);
    }

    getAllCategories = async (params: any = {}) => {
        this.loading = true;
        try {
            const response = await axios.get("/category", { params });
            runInAction(() => {
                if (response.data.status === "success") {
                    this.categories = response.data.data;
                    this.totalCategories = response.data.data.length;
                }
            });
            return response.data;
        } catch (error: any) {
            // eslint-disable-next-line no-console
            console.error("Error fetching categories:", error);
            return error.response?.data || { status: "error", message: "Failed to fetch categories" };
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    createCategory = async (data: FormData) => {
        this.loading = true;
        try {
            const response = await axios.post("/category", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            runInAction(() => {
                if (response.data.status === "success") {
                    this.getAllCategories();
                }
            });
            return response.data;
        } catch (error: any) {
            // eslint-disable-next-line no-console
            console.error("Error creating category:", error);
            return error.response?.data || { status: "error", message: "Failed to create category" };
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    updateCategory = async (id: string, data: FormData) => {
        this.loading = true;
        try {
            const response = await axios.put(`/category/${id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            runInAction(() => {
                if (response.data.status === "success") {
                    this.getAllCategories();
                }
            });
            return response.data;
        } catch (error: any) {
            // eslint-disable-next-line no-console
            console.error("Error updating category:", error);
            return error.response?.data || { status: "error", message: "Failed to update category" };
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    deleteCategory = async (id: string) => {
        this.loading = true;
        try {
            const response = await axios.delete(`/category/${id}`);
            runInAction(() => {
                if (response.data.status === "success") {
                    this.categories = this.categories.filter((c) => c._id !== id);
                }
            });
            return response.data;
        } catch (error: any) {
            // eslint-disable-next-line no-console
            console.error("Error deleting category:", error);
            return error.response?.data || { status: "error", message: "Failed to delete category" };
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    };
}

const categoryStore = new CategoryStore();
export default categoryStore;
