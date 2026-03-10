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
            { title: "Electronics", link: "/categories?slug=electronics" },
            { title: "Clothing", link: "/categories?slug=clothing" },
            { title: "Home & Gardeen", link: "/homegardeen" },
            { title: "Sports", link: "/categories?slug=sports" },
            { title: "Toys", link: "/categories?slug=toys" },
            { title: "Health & Beauty", link: "/categories?slug=healthbeauty" },
            { title: "Automotive", link: "/categories?slug=automotive" },
            { title: "Show All", link: "/categories" },
        ],
    },
];
