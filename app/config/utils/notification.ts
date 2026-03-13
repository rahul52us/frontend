import stores from "../../store/stores";

type AppNotificationType = "success" | "error" | "info" | "warning";

interface AppNotificationPayload {
  title?: string;
  message: string;
  type?: AppNotificationType;
  placement?: string;
  action?: any;
  duration?: number;
  image?: string;
}

export const notify = (payload: AppNotificationPayload) => {
  stores.auth.openNotification(payload);
};

export const notifySuccess = (message: string, options: Omit<AppNotificationPayload, "message" | "type"> = {}) => {
  stores.auth.notifySuccess(message, options);
};

export const notifyError = (message: string, options: Omit<AppNotificationPayload, "message" | "type"> = {}) => {
  stores.auth.notifyError(message, options);
};

export const notifyInfo = (message: string, options: Omit<AppNotificationPayload, "message" | "type"> = {}) => {
  stores.auth.notifyInfo(message, options);
};

export const notifyWarning = (message: string, options: Omit<AppNotificationPayload, "message" | "type"> = {}) => {
  stores.auth.notifyWarning(message, options);
};

export default {
  notify,
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarning,
};
