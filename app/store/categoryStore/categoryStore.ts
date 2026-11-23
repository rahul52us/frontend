import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

class CategoryStore {
    categories: any[] = [];
    topCategories: any[] = [];
    topLoading: boolean = false;
    loading: boolean = false;
    totalCategories: number = 0;
    activeCategories: number = 0;
    rootCategories: number = 0;
    filterReadyCategories: number = 0;
    currentPage: number = 1;
    totalPages: number = 1;
    limit: number = 10;
    categoriesCache: any = null;
    lastCategoriesPayload: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    getAllCategories = async (params: any = {}, forceRefresh: boolean = false) => {
        const currentPayload = JSON.stringify(params);

        if (!forceRefresh && this.categoriesCache && this.lastCategoriesPayload === currentPayload) {
            runInAction(() => {
                this.categories = this.categoriesCache.data;
                this.totalCategories = this.categoriesCache.pagination?.totalCategories ?? this.categoriesCache.data.length;
                this.activeCategories = this.categoriesCache.stats?.activeCategories ?? this.activeCategories;
                this.rootCategories = this.categoriesCache.stats?.rootCategories ?? this.rootCategories;
                this.filterReadyCategories = this.categoriesCache.stats?.filterReadyCategories ?? this.filterReadyCategories;
                this.currentPage = this.categoriesCache.pagination?.currentPage ?? 1;
                this.totalPages = this.categoriesCache.pagination?.totalPages ?? 1;
                this.limit = this.categoriesCache.pagination?.limit ?? 10;
            });
            return this.categoriesCache;
        }

        this.loading = true;
        try {
            const response = await axios.get("/category", { params });
            runInAction(() => {
                if (response.data.status === "success") {
                    this.categories = response.data.data;
                    this.totalCategories = response.data.pagination?.totalCategories ?? response.data.data.length;
                    this.activeCategories = response.data.stats?.activeCategories ?? response.data.data.filter((c: any) => c.isActive).length;
                    this.rootCategories = response.data.stats?.rootCategories ?? response.data.data.filter((c: any) => !c.parent).length;
                    this.filterReadyCategories = response.data.stats?.filterReadyCategories ?? response.data.data.filter((c: any) => (c.filterConfig || []).length > 0).length;
                    this.currentPage = response.data.pagination?.currentPage ?? 1;
                    this.totalPages = response.data.pagination?.totalPages ?? 1;
                    this.limit = response.data.pagination?.limit ?? 10;
                    this.categoriesCache = response.data;
                    this.lastCategoriesPayload = currentPayload;
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
                    this.categoriesCache = null; // Invalidate cache
                    this.lastCategoriesPayload = null;
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
                    this.categoriesCache = null; // Invalidate cache
                    this.lastCategoriesPayload = null;
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

    getTopCategories = async (limit: number = 10) => {
        if (this.topCategories.length > 0) {
            return { status: "success", data: this.topCategories };
        }

        this.topLoading = true;
        try {
            const response = await axios.get("/category/top", { params: { limit } });
            runInAction(() => {
                if (response.data.status === "success") {
                    this.topCategories = response.data.data;
                }
            });
            return response.data;
        } catch (error: any) {
            // eslint-disable-next-line no-console
            console.error("Error fetching top categories:", error);
            return error.response?.data || { status: "error", message: "Failed to fetch top categories" };
        } finally {
            runInAction(() => {
                this.topLoading = false;
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
                    this.categoriesCache = null; // Invalidate cache
                    this.lastCategoriesPayload = null;
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

    seedCatalog = async (reset: boolean = false) => {
        this.loading = true;
        try {
            const response = await axios.post("/category/seed-catalog", { reset });
            runInAction(() => {
                if (response.data.status === "success") {
                    this.categoriesCache = null; // Invalidate cache
                    this.lastCategoriesPayload = null;
                    this.getAllCategories({}, true);
                }
            });
            return response.data;
        } catch (error: any) {
            // eslint-disable-next-line no-console
            console.error("Error seeding category catalog:", error);
            return error.response?.data || { status: "error", message: "Failed to seed category catalog" };
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    };
}

const categoryStore = new CategoryStore();
export default categoryStore;
