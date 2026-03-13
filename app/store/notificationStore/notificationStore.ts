import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

export type NotificationStatusFilter = "all" | "unread";

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  category?: string;
  priority?: "low" | "medium" | "high";
  actionUrl?: string;
  meta?: Record<string, any>;
  isRead: boolean;
  readAt?: string;
  sourceType?: string;
  sourceId?: string;
  createdAt: string;
  updatedAt: string;
}

class NotificationStore {
  items: NotificationItem[] = [];
  unreadCount = 0;
  loading = false;
  error: string | null = null;

  page = 1;
  limit = 10;
  total = 0;
  totalPages = 0;
  status: NotificationStatusFilter = "all";

  private pollingTimer: ReturnType<typeof setInterval> | null = null;
  private readonly pollIntervalMs = 30_000;
  private activeUserId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  init = async (userId?: string) => {
    const nextUserId = typeof userId === "string" ? userId : this.activeUserId;
    if (!nextUserId) {
      return;
    }

    if (this.activeUserId !== nextUserId) {
      this.clearStateForUser();
      this.activeUserId = nextUserId;
    }

    await Promise.all([this.fetchUnreadCount(), this.fetchList({ page: 1, status: this.status })]);
    this.startPolling();
    this.bindFocusRefresh();
  };

  dispose = () => {
    this.stopPolling();
    this.unbindFocusRefresh();
    this.activeUserId = null;
    this.clearStateForUser();
  };

  private clearStateForUser = () => {
    this.items = [];
    this.unreadCount = 0;
    this.page = 1;
    this.total = 0;
    this.totalPages = 0;
    this.error = null;
  };

  fetchList = async (params?: {
    status?: NotificationStatusFilter;
    page?: number;
    limit?: number;
  }) => {
    if (!this.activeUserId) {
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const nextStatus = params?.status || this.status;
      const nextPage = params?.page || this.page;
      const nextLimit = params?.limit || this.limit;

      const response = await axios.get("/notifications", {
        params: {
          status: nextStatus,
          page: nextPage,
          limit: nextLimit,
        },
      });

      const payload = response?.data?.data || {};

      runInAction(() => {
        this.items = Array.isArray(payload.items) ? payload.items : [];
        this.page = Number(payload.page || nextPage || 1);
        this.limit = Number(payload.limit || nextLimit || 10);
        this.total = Number(payload.total || 0);
        this.totalPages = Number(payload.totalPages || 0);
        this.status = nextStatus;
        if (typeof payload.unreadCount === "number") {
          this.unreadCount = payload.unreadCount;
        }
      });

      return payload;
    } catch (error: any) {
      runInAction(() => {
        this.error = error?.response?.data?.message || "Failed to fetch notifications";
      });
      return Promise.reject(error?.response?.data || error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  fetchNotifications = this.fetchList;

  fetchUnreadCount = async () => {
    if (!this.activeUserId) {
      return 0;
    }

    try {
      const response = await axios.get("/notifications/unread-count");
      const count = Number(response?.data?.data?.unreadCount || 0);

      runInAction(() => {
        this.unreadCount = count;
      });

      return count;
    } catch (error: any) {
      runInAction(() => {
        this.error = error?.response?.data?.message || "Failed to fetch unread notification count";
      });
      return 0;
    }
  };

  markRead = async (id: string) => {
    if (!this.activeUserId) {
      return;
    }

    try {
      const response = await axios.patch(`/notifications/${id}/read`);
      const unreadCountFromApi = response?.data?.data?.unreadCount;

      runInAction(() => {
        this.items = this.items.map((item) =>
          item._id === id
            ? {
                ...item,
                isRead: true,
                readAt: item.readAt || new Date().toISOString(),
              }
            : item
        );

        if (typeof unreadCountFromApi === "number") {
          this.unreadCount = unreadCountFromApi;
        } else {
          const nextCount = this.items.filter((item) => !item.isRead).length;
          this.unreadCount = Math.max(nextCount, 0);
        }
      });

      return response?.data;
    } catch (error: any) {
      runInAction(() => {
        this.error = error?.response?.data?.message || "Failed to mark notification as read";
      });
      return Promise.reject(error?.response?.data || error);
    }
  };

  markAllRead = async () => {
    if (!this.activeUserId) {
      return;
    }

    try {
      const response = await axios.patch("/notifications/read-all");

      runInAction(() => {
        this.items = this.items.map((item) => ({
          ...item,
          isRead: true,
          readAt: item.readAt || new Date().toISOString(),
        }));
        this.unreadCount = 0;
      });

      return response?.data;
    } catch (error: any) {
      runInAction(() => {
        this.error = error?.response?.data?.message || "Failed to mark all notifications as read";
      });
      return Promise.reject(error?.response?.data || error);
    }
  };

  startPolling = () => {
    if (!this.activeUserId || this.pollingTimer) {
      return;
    }

    this.pollingTimer = setInterval(() => {
      this.pollNow();
    }, this.pollIntervalMs);
  };

  stopPolling = () => {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
  };

  private pollNow = async () => {
    if (!this.activeUserId) {
      return;
    }

    await Promise.all([
      this.fetchUnreadCount(),
      this.fetchList({
        status: this.status,
        page: this.page,
        limit: this.limit,
      }),
    ]);
  };

  private handleVisibilityRefresh = async () => {
    if (typeof document === "undefined") {
      return;
    }
    if (document.visibilityState === "visible") {
      await this.pollNow();
    }
  };

  private handleWindowFocus = async () => {
    await this.pollNow();
  };

  private bindFocusRefresh = () => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    this.unbindFocusRefresh();
    window.addEventListener("focus", this.handleWindowFocus);
    document.addEventListener("visibilitychange", this.handleVisibilityRefresh);
  };

  private unbindFocusRefresh = () => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    window.removeEventListener("focus", this.handleWindowFocus);
    document.removeEventListener("visibilitychange", this.handleVisibilityRefresh);
  };
}

const notificationStore = new NotificationStore();

export default notificationStore;
