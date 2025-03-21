import { action, makeObservable, observable } from "mobx";

class LayoutStore {
  isCallapse = true;
  openMobileSideDrawer = false;
  selectMenu: any = null;
  themeMode = "light";
  headerSettingDrawer = false;
  mediumScreenMode = false;
  fullScreenMode = false;
  MobileSidebar = false;
  SearchDialog = false;
  showDashboardNote = false;
  openNotification = false;

  constructor() {
    makeObservable(this, {
      selectMenu: observable,
      headerSettingDrawer: observable,
      fullScreenMode: observable,
      MobileSidebar: observable,
      SearchDialog: observable,
      showDashboardNote: observable,
      themeMode: observable,
      openNotification: observable,
      mediumScreenMode: observable,
      isCallapse: observable,
      openMobileSideDrawer: observable,
      setSelectedMenu: action,
      setShowDashboardNote: action,
      headerSettingDrawerFun: action,
      fullScreenModeFun: action,
      mediumScreenModeFun: action,
      MobileSidebarFun: action,
      SearchDialogFun: action,
      changeThemeMode: action,
      setOpenNotification: action,
      resetLayout: action,
      openDashSidebarFun: action,
      setOpenMobileSideDrawer: action,
    });

    // Only run on the client side
    if (typeof window !== "undefined") {
      this.selectMenu = localStorage.getItem("selected_menu")
        ? JSON.parse(localStorage.getItem("selected_menu") as string)
        : null;
      this.themeMode = localStorage.getItem("theme_mode") === "dark" ? "dark" : "light";
      this.headerSettingDrawer = localStorage.getItem("headerSettingDrawer") === "true";
      this.mediumScreenMode = localStorage.getItem("mediumScreenMode") === "true";
      this.fullScreenMode = localStorage.getItem("fullScreenMode") === "true";
      this.MobileSidebar = localStorage.getItem("MobileSidebar") === "true";
      this.SearchDialog = localStorage.getItem("SearchDialog") === "true";
      this.showDashboardNote = localStorage.getItem("showDashboardNote") === "true";
      this.openNotification = localStorage.getItem("OpenNotification") === "true";
    }
  }

  setSelectedMenu = (status: any) => {
    this.selectMenu = status;
    if (typeof window !== "undefined") {
      localStorage.setItem("selected_menu", JSON.stringify(status));
    }
  };

  openDashSidebarFun = (status?: boolean) => {
    this.isCallapse = status;
  };

  setOpenMobileSideDrawer = (status?: boolean) => {
    this.openMobileSideDrawer = status;
  };

  headerSettingDrawerFun = (status: boolean) => {
    this.headerSettingDrawer = status;
    if (typeof window !== "undefined") {
      localStorage.setItem("headerSettingDrawer", String(status));
    }
  };

  fullScreenModeFun = (status: boolean) => {
    this.fullScreenMode = status;
    if (typeof window !== "undefined") {
      localStorage.setItem("fullScreenMode", String(status));
    }
  };

  mediumScreenModeFun = (status: boolean) => {
    this.mediumScreenMode = status;
    if (typeof window !== "undefined") {
      localStorage.setItem("mediumScreenMode", String(status));
    }
  };

  MobileSidebarFun = (status: boolean) => {
    this.MobileSidebar = status;
    if (typeof window !== "undefined") {
      localStorage.setItem("MobileSidebar", String(status));
    }
  };

  SearchDialogFun = (status: boolean) => {
    this.SearchDialog = status;
    if (typeof window !== "undefined") {
      localStorage.setItem("SearchDialog", String(status));
    }
  };

  setShowDashboardNote = (status: boolean) => {
    this.showDashboardNote = status;
    if (typeof window !== "undefined") {
      localStorage.setItem("showDashboardNote", String(status));
    }
  };

  changeThemeMode = (status: "light" | "dark") => {
    this.themeMode = status;
    if (typeof window !== "undefined") {
      localStorage.setItem("theme_mode", status);
    }
  };

  setOpenNotification = (status: boolean) => {
    this.openNotification = status;
    if (typeof window !== "undefined") {
      localStorage.setItem("OpenNotification", String(status));
    }
  };

  resetLayout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("headerSettingDrawer");
      localStorage.removeItem("fullScreenMode");
      localStorage.removeItem("MobileSidebar");
      localStorage.removeItem("SearchDialog");
      localStorage.removeItem("showDashboardNote");
      localStorage.removeItem("theme_mode");
      localStorage.removeItem("OpenNotification");
    }
    this.headerSettingDrawer = false;
    this.fullScreenMode = false;
    this.MobileSidebar = false;
    this.SearchDialog = false;
    this.showDashboardNote = false;
    this.themeMode = "light";
    this.openNotification = false;
  };
}

export const layoutStore = new LayoutStore();
