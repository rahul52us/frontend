import {
  FaChartPie,
  FaCog,
  FaBox,
} from "react-icons/fa";

interface SidebarItem {
  id: number;
  name: string;
  icon: any;
  url: string;
  role?: string[];
  children?: SidebarItem[];
}

const sidebarDatas: SidebarItem[] = [
  {
    id: 1,
    name: "Dashboard",
    icon: <FaChartPie />,
    url: "/dashboard",
    role: ["user", "admin"],
  },
  {
    id: 101,
    name: "Dashboard",
    icon: <FaChartPie />,
    url: "/super-admin/dashboard",
    role: ["superAdmin"],
  },
  {
    id: 102,
    name: "Categories",
    icon: <FaBox />,
    url: "/super-admin/categories",
    role: ["superAdmin"],
  },
  {
    id: 103,
    name: "Shops",
    icon: <FaChartPie />,
    url: "/super-admin/shops",
    role: ["superAdmin"],
  },
  {
    id: 104,
    name: "Products",
    icon: <FaBox />,
    url: "/super-admin/products",
    role: ["superAdmin"],
  },
  {
    id: 2,
    name: "Shops",
    icon: <FaChartPie />,
    url: "/dashboard/shop",
    role: ["user", "admin"],
  },
  {
    id: 6,
    name: "Products",
    icon: <FaBox />,
    url: "/dashboard/products",
    role: ["user", "admin"],
  },
  {
    id: 7,
    name: "Orders",
    icon: <FaChartPie />,
    url: "/dashboard/orders",
    role: ["user", "admin"],
  },
  // Blogs
  // {
  //   id: 501,
  //   name: "Blogs",
  //   icon: <FaBookOpen />,
  //   url: dashboard.blog.index,
  //   role: ["user", "superadmin", "manager", "admin"],
  //   children: [
  //     {
  //       id: 502,
  //       name: "Index",
  //       icon: <CalendarIcon />,
  //       url: `${dashboard.blog.index}`,
  //       role: ["user", "superadmin", "manager", "admin"],
  //     },
  //     {
  //       id: 503,
  //       name: "Create",
  //       icon: <FaBuilding />,
  //       url: `${dashboard.blog.create}`,
  //       role: ["superadmin", "manager", "admin"],
  //     },
  //   ],
  // },
];

export const sidebarFooterData: SidebarItem[] = [
  {
    id: 34,
    name: "Settings",
    icon: <FaCog />,
    url: "/profile",
    role: ["user", "admin", "superAdmin", "manager"],
  },
];

const getSidebarDataByRole = (role: string[] = ["user"]): SidebarItem[] => {
  const filterByRole = (items: SidebarItem[]): SidebarItem[] => {
    return items
      .filter((item) => !item.role || item.role.some((r) => role.includes(r)))
      .map((item) => ({
        ...item,
        children: item.children ? filterByRole(item.children) : undefined,
      }));
  };
  return filterByRole(sidebarDatas);
};

// Example usage
const userRole = ["user"]; // Example role
const sidebarData = getSidebarDataByRole(userRole);

export { sidebarData, getSidebarDataByRole };
