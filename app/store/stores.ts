// store/index.ts
import { authStore } from "./authStore/authStore";
import { cartStore } from "./cartStore/CartStore";
import { blogStore } from "./blogStore/blogStore";
import { CompanyStore } from "./companyStore/companyStore";
import { themeStore } from "./themeStore/themeStore";
import { userStore } from "./userStore/userStore";
import { layoutStore } from './layoutStore/LayoutStore'
import { orderStore } from "./orderStore/orderStore";
import { shopStore } from "./shopStore/shopStore";
import categoryStore from "./categoryStore/categoryStore";
import offerStore from "./offerStore/offerStore";
import buyerStore from "./buyerStore/buyerStore";
import notificationStore from "./notificationStore/notificationStore";

const stores = {
  auth: authStore,
  userStore: userStore,
  themeStore: themeStore,
  shopStore: shopStore,
  layout: layoutStore,
  BlogStore: blogStore,
  companyStore: CompanyStore,
  orderStore: orderStore,
  cartStore: cartStore,
  categoryStore: categoryStore,
  offerStore: offerStore,
  buyerStore: buyerStore,
  notificationStore: notificationStore,
};

export default stores;
