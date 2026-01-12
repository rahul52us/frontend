export const navItems = [
    { title: "Home", link: "/" },
    { title: "About", link: "/about" },
    {
        title: "Shops",
        link: "/shops",
        children: [
            { title: "Local Shops", link: "/shops/" },
            { title: "Online Shops", link: "/shops" },
        ],
    },
    {
        title: "Categories",
        link: "/categories",
        children: [
            { title: "Electronics", link: "/categories/electronics" },
            { title: "Clothing", link: "/categories/clothing" },
            { title: "Home & Gardeen", link: "/homegardeen" },
            { title: "Sports", link: "/categories/sports" },
            { title: "Toys", link: "/categories/toys" },
            { title: "Health & Beauty", link: "/categories/healthbeauty" },
            { title: "Automotive", link: "/categories/automotive" },
        ],
    },
];
