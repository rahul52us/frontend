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

  private readonly unreadRefreshWindowMs = 10_000;
  private readonly listRefreshWindowMs = 15_000;
  private activeUserId: string | null = null;
  private lastUnreadCountFetchedAt = 0;
  private lastListFetchedAt = 0;
  private lastListFetchKey = "";

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

    await this.fetchUnreadCount();
  };

  dispose = () => {
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
    this.lastUnreadCountFetchedAt = 0;
    this.lastListFetchedAt = 0;
    this.lastListFetchKey = "";
  };

  fetchList = async (params?: {
    status?: NotificationStatusFilter;
    page?: number;
    limit?: number;
    force?: boolean;
    background?: boolean;
  }) => {
    if (!this.activeUserId) {
      return;
    }

    try {
      const nextStatus = params?.status || this.status;
      const nextPage = params?.page || this.page;
      const nextLimit = params?.limit || this.limit;
      const requestKey = JSON.stringify({
        status: nextStatus,
        page: nextPage,
        limit: nextLimit,
      });
      const shouldUseCache =
        !params?.force &&
        this.lastListFetchKey === requestKey &&
        Date.now() - this.lastListFetchedAt < this.listRefreshWindowMs &&
        this.items.length > 0;

      if (shouldUseCache) {
        return {
          items: this.items,
          page: this.page,
          limit: this.limit,
          total: this.total,
          totalPages: this.totalPages,
          unreadCount: this.unreadCount,
        };
      }

      if (!params?.background) {
        this.loading = true;
      }
      this.error = null;

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
        this.lastListFetchedAt = Date.now();
        this.lastListFetchKey = requestKey;
        if (typeof payload.unreadCount === "number") {
          this.unreadCount = payload.unreadCount;
          this.lastUnreadCountFetchedAt = Date.now();
        }
      });

      return payload;
    } catch (error: any) {
      runInAction(() => {
        this.error = error?.response?.data?.message || "Failed to fetch notifications";
      });
      return Promise.reject(error?.response?.data || error);
    } finally {
      if (!params?.background) {
        runInAction(() => {
          this.loading = false;
        });
      }
    }
  };

  fetchNotifications = this.fetchList;

  fetchUnreadCount = async (options?: { force?: boolean }) => {
    if (!this.activeUserId) {
      return 0;
    }

    const shouldUseCache =
      !options?.force &&
      this.lastUnreadCountFetchedAt > 0 &&
      Date.now() - this.lastUnreadCountFetchedAt < this.unreadRefreshWindowMs;

    if (shouldUseCache) {
      return this.unreadCount;
    }

    try {
      const response = await axios.get("/notifications/unread-count");
      const count = Number(response?.data?.data?.unreadCount || 0);

      runInAction(() => {
        this.unreadCount = count;
        this.lastUnreadCountFetchedAt = Date.now();
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
}

const notificationStore = new NotificationStore();

export default notificationStore;
