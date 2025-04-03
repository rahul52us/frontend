export const navItems = [
    { title: "Home", link: "/" },
    { title: "About", link: "/about" },
    {
        title: "Shops",
        link: "/shops",
        children: [
            { title: "Local Shops", link: "/shops/local" },
            { title: "Online Shops", link: "/shops/online" },
        ],
    },
    {
        title: "Categories",
        link: "/categories",
        children: [
            { title: "Electronics", link: "/categories/electronics" },
            { title: "Clothing", link: "/categories/clothing" },
        ],
    },
];
