import { FaInstagram, FaLinkedinIn, FaFacebook, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";

export const footerData = {
  companyInfo: {
    name: "BusinessSahayata",
    tagline: "Empowering Local Businesses",
    supportNumber: "+91 9090 404949",
    socialLinks: [
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/company/businesssahayata/",
        icon: FaLinkedinIn
      },
      {
        name: "Twitter",
        url: "https://x.com/businesssahayata",
        icon: FaXTwitter
      },
      {
        name: "Instagram",
        url: "https://www.instagram.com/businesssahayata/",
        icon: FaInstagram
      },
      {
        name: "Facebook",
        url: "https://www.facebook.com/businesssahayata",
        icon: FaFacebook
      },
      {
        name: "YouTube",
        url: "https://www.youtube.com/@businesssahayata",
        icon: FaYoutube
      }
    ]
  },
  contactInfo: {
    phone: "+91 9090 404949",
    email: "support@businesssahayata.com",
    address: "3rd Floor, Startup Hub, Sector 62, Noida, UP, IN- 201301"
  },
  sections: [
    {
      title: "Quick Links",
      links: [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/about" },
        { name: "Find Businesses", href: "/businesses" },
        { name: "Register Your Business", href: "/register-business" },
        { name: "Contact Us", href: "/contact" },
        { name: "FAQ", href: "/faq" }
      ]
    },
    {
      title: "Business Categories",
      links: [
        { name: "Grocery Stores", href: "/category/grocery" },
        { name: "Electronics & Appliances", href: "/category/electronics" },
        { name: "Clothing & Fashion", href: "/category/clothing" },
        { name: "Restaurants & Cafes", href: "/category/restaurants" },
        { name: "Beauty & Wellness", href: "/category/beauty" },
        { name: "Healthcare & Pharmacies", href: "/category/healthcare" }
      ]
    },
    {
      title: "Services for Businesses",
      links: [
        { name: "Business Marketing", href: "/services/marketing" },
        { name: "Digital Presence", href: "/services/digital-presence" },
        { name: "Vendor Management", href: "/services/vendor-management" },
        { name: "Financial Support", href: "/services/financial-support" },
        { name: "Online Orders", href: "/services/online-orders" }
      ]
    }
  ],

  legalLinks: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Refund Policy", href: "/refund-policy" }
  ]
};
