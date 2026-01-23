import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { AUTH_TOKEN } from "../../config/utils/variables";

export interface CartItem {
    _id?: string; // Optional for local items
    product: any; // Full product object
    quantity: number;
}

class CartStore {
    cartItems: CartItem[] = [];
    loading: boolean = false;
    error: string | null = null;
    localStorageKey = "guest_cart";

    constructor() {
        makeAutoObservable(this);
        // Cart will be fetched explicitly when needed (Header, Cart page, Checkout)
        // Removed auto-fetch to prevent unnecessary API calls on every page load
    }

    get isLoggedIn() {
        if (typeof window !== "undefined") {
            return !!localStorage.getItem(AUTH_TOKEN);
        }
        return false;
    }

    get totalItems() {
        return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    }

    fetchCart = async (forceRefresh: boolean = false) => {
        // Skip if cart already loaded and user hasn't changed (prevent double fetch)
        if (!forceRefresh && this.cartItems.length > 0 && this.isLoggedIn) {
            return;
        }

        this.loading = true;
        try {
            if (this.isLoggedIn) {
                await this.fetchUserCart();
            } else {
                this.fetchLocalCart();
            }
        } catch (err: any) {
            runInAction(() => {
                this.error = err.message;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    fetchLocalCart = () => {
        const stored = localStorage.getItem(this.localStorageKey);
        if (stored) {
            this.cartItems = JSON.parse(stored);
        }
    };

    fetchUserCart = async () => {
        try {
            const response = await axios.get("/cart");
            const backendCart = response.data?.data;
            runInAction(() => {
                if (backendCart && backendCart.items) {
                    // Map backend items to store format
                    this.cartItems = backendCart.items.map((item: any) => ({
                        product: item.product,
                        quantity: item.quantity
                    }));
                } else {
                    this.cartItems = [];
                }
            });
        } catch (err: any) {
            // alert(err?.message)
            // Silently fail or log, don't alert on every page load if cart fails
            console.error(err);
        }
    };

    addToCart = async (product: any, quantity: number = 1) => {
        this.loading = true;
        try {
            if (this.isLoggedIn) {
                this.optimisticAdd(product, quantity);

                await axios.post("/cart/add", {
                    product: product._id || product.id,
                    quantity
                });
            } else {
                this.optimisticAdd(product, quantity);
                this.saveToLocalStorage();
            }
        } catch (err: any) {
            this.error = err.message;
        } finally {
            this.loading = false;
        }
    };

    optimisticAdd = (product: any, quantity: number) => {
        const existingIndex = this.cartItems.findIndex(
            (item) => (item.product._id || item.product.id) === (product._id || product.id)
        );

        if (existingIndex > -1) {
            this.cartItems[existingIndex].quantity += quantity;
        } else {
            this.cartItems.push({ product, quantity });
        }
    };

    saveToLocalStorage = () => {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
    };

    removeFromCart = async (productId: string) => {
        this.loading = true;
        try {
            if (this.isLoggedIn) {
                this.optimisticRemove(productId);
                await axios.post("/cart/remove", { productId });
            } else {
                this.optimisticRemove(productId);
                this.saveToLocalStorage();
            }
        } catch (err: any) {
            this.error = err.message;
        } finally {
            this.loading = false;
        }
    }

    optimisticRemove = (productId: string) => {
        this.cartItems = this.cartItems.filter(item => (item.product._id || item.product.id) !== productId);
    }

    updateQuantity = async (productId: string, quantity: number) => {
        this.loading = true;
        try {
            if (quantity < 1) {
                await this.removeFromCart(productId);
                return;
            }

            if (this.isLoggedIn) {
                this.optimisticUpdate(productId, quantity);
                await axios.post("/cart/update", { productId, quantity });
            } else {
                this.optimisticUpdate(productId, quantity);
                this.saveToLocalStorage();
            }

        } catch (err: any) {
            this.error = err.message;
        } finally {
            this.loading = false;
        }
    }

    optimisticUpdate = (productId: string, quantity: number) => {
        const item = this.cartItems.find(item => (item.product._id || item.product.id) === productId);
        if (item) {
            item.quantity = quantity;
        }
    }

    syncCart = async () => {
        const localItems = JSON.parse(localStorage.getItem(this.localStorageKey) || "[]");
        if (localItems.length > 0) {
            const itemsToSync = localItems.map((item: any) => ({
                product: item.product._id || item.product.id,
                quantity: item.quantity
            }));

            await axios.post("/cart/sync", { items: itemsToSync });
            localStorage.removeItem(this.localStorageKey);
        }
        await this.fetchCart();
    };

    clearCart = () => {
        this.cartItems = [];
        if (!this.isLoggedIn) {
            localStorage.removeItem(this.localStorageKey);
        }
    }
}

export const cartStore = new CartStore();
