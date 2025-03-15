// store/index.ts
import { authStore } from "./authStore/authStore";
import { blogStore } from "./blogStore/blogStore";
import { CompanyStore } from "./companyStore/companyStore";
import { testimonialStore } from "./testimonialStore/testimonialStore";
import { userStore } from "./userStore/userStore";
import {theme} from "../theme/theme";
import { shopStore } from "./shopStore/shopStore";

const stores = {
  auth : authStore,
  themeStore : theme,
  userStore : userStore,
  shopStore : shopStore,
  BlogStore : blogStore,
  companyStore : CompanyStore,
  testimonialStore : testimonialStore
};

export default stores;