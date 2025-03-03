import { FaTwitter, FaInstagram, FaLinkedinIn, FaFacebook } from 'react-icons/fa';
// import { FooterProps } from '../components/footer/types';

export const footerData = {
  companyInfo: {
    name: "Metamind",
    tagline: "Talk. Listen. Recover",
    crisisNumber: "888-888-88",
    socialLinks: [
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/company/metamind-healthcare/",
        icon: FaLinkedinIn
      },
      {
        name: "Twitter",
        url: "https://x.com/metamindhealth",
        icon: FaTwitter
      },
      {
        name: "Instagram",
        url: "https://www.instagram.com/metamindhealth/",
        icon: FaInstagram
      },
      {
        name: "Facebook",
        url: "https://www.facebook.com/profile.php?id=61562244046160",
        icon: FaFacebook
      },
    ]
  },
  contactInfo: {
    phone: "+91 9090404949",
    email: "Support@metamindhealth.com",
    address: "2nd Floor, LC complex, Sector 49, Noida, UP, IN- 201301"
  },
  sections: [
    {
      title: "Quick Links",
      links: [
        { name: "Home", href: "/home" },
        // { name: "About Us", href: "/about" },
        { name: "Therapists", href: "/therapist" },
        // { name: "Self-Assessments", href: "/self-assessments" },
        // { name: "Resources & Blogs", href: "/resources-blogs" },
        { name: "Contact Us", href: "/contact-us" },
        // { name: "Join as Therapist", href: "/join-therapist" },
        { name: "FAQ", href: "/faq" }
      ]
    },
    {
      title: "Our Services",
      links: [
        { name: "Individual Therapy", href: "/therapist" },
        { name: "Couple & Family Therapy", href: "/services/couple-family" },
        { name: "Teen Therapy", href: "/therapist" },
        { name: "Psychological Assessment", href: "/therapist" },
        { name: "Specialized Therapy", href: "/therapist" }
      ]
    },
    // {
    //   title: "Conditions We Treat",
    //   links: [
    //     { name: "Depression", href: "/conditions/depression" },
    //     { name: "Anxiety", href: "/conditions/anxiety" },
    //     { name: "Social Anxiety", href: "/conditions/social-anxiety" },
    //     { name: "ADHD", href: "/conditions/adhd" },
    //     { name: "Bipolar Disorder", href: "/conditions/bipolar-disorder" },
    //     { name: "OCD", href: "/conditions/ocd" },
    //     { name: "Sleep Disorder", href: "/conditions/sleep-disorder" },
    //     { name: "Trauma", href: "/conditions/trauma" },
    //     { name: "Post-partum Depression", href: "/conditions/post-partum-depression" },
    //     { name: "Autism", href: "/conditions/autism" },
    //     { name: "Eating Disorder", href: "/conditions/eating-disorder" },
    //     { name: "Personality Disorder", href: "/conditions/personality-disorder" }
    //   ]
    // }
  ],

  legalLinks: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cancellation Policy", href: "/cancellation" }
  ]
};
