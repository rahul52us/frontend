// store/index.ts
import { authStore } from "./authStore/authStore";
import { blogStore } from "./blogStore/blogStore";
import { CompanyStore } from "./companyStore/companyStore";
import { testimonialStore } from "./testimonialStore/testimonialStore";
import { userStore } from "./userStore/userStore";
import {theme} from "../theme/theme";

const stores = {
  auth : authStore,
  themeStore : theme,
  userStore : userStore,
  BlogStore : blogStore,
  companyStore : CompanyStore,
  testimonialStore : testimonialStore
};

export default stores;