// store/index.ts
import { authStore } from "./authStore/authStore";
import { cartStore } from "./cartStore/CartStore";
import { blogStore } from "./blogStore/blogStore";
import { CompanyStore } from "./companyStore/companyStore";
import { contactStore } from "./contactStore/contactStore";
import { testimonialStore } from "./testimonialStore/testimonialStore";
import { themeStore } from "./themeStore/themeStore";
import { userStore } from "./userStore/userStore";
import { layoutStore } from './layoutStore/LayoutStore'
import { orderStore } from "./orderStore/orderStore";
import { shopStore } from "./shopStore/shopStore";
import categoryStore from "./categoryStore/categoryStore";

const stores = {
  auth: authStore,
  userStore: userStore,
  themeStore: themeStore,
  shopStore: shopStore,
  layout: layoutStore,
  contactStore: contactStore,
  BlogStore: blogStore,
  companyStore: CompanyStore,
  orderStore: orderStore,
  testimonialStore: testimonialStore,
  cartStore: cartStore,
  categoryStore: categoryStore
};

export default stores;