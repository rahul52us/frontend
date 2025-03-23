interface Rating {  
  score: number;  
  reviewsCount: number;  
}  

interface PriceDetails {  
  currentPrice: string;  
  discount: number;  
  originalPrice: string;  
}  

interface Color {  
  name: string;  
  image: string;  
}  

interface Service {  
  type: string;  
  label: string;  
}  

interface Highlight {  
  label: string;  
  value: string | string[];  
}  

interface Information {  
  label: string;  
  value: string;  
}  

interface ProductData {  
  brand: string;  
  title: string;  
  rating: Rating;  
  priceDetails: PriceDetails;  
  colors?: Color[];  
  sizes?: string[];  
  offers: string[];  
  services: Service[];  
  highlights: Highlight[];  
  information: Information[];  
}  



export const productData:ProductData = { 
    brand: 'Campus',
    title: "Campus Syrus Black Men's Running Shoes - UK 8",
    rating: {
      score: 4.2,
      reviewsCount: 124,
    },
    priceDetails: {
      currentPrice: '₹1290',
      discount: 26,
      originalPrice: '₹1699',
    },
    colors: [
      { name: 'Black', image: 'https://img.freepik.com/free-photo/fashion-shoes-sneakers_1203-7526.jpg?uid=R98118533&ga=GA1.1.1625681573.1739726311&semt=ais_keywords_boost' },
      { name: 'Blue', image: 'https://example.com/blue-shoes.jpg' },
    ],
    sizes: ['8 UK', '9 UK', '10 UK', '11 UK'],
    offers: [
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
      'Another offer details here',
    ],
    services: [
      { type: 'return', label: '3 Days Return' },
      { type: 'exchange', label: 'Easy Exchange' },
      { type: 'freeShipping', label: 'Free Shipping' },
    ],
    highlights: [
      { label: 'Water Resistance', value: 'No' },
      { label: 'Brand', value: 'Campus' },
      { label: 'Closure Type', value: 'Lace-up' },
      { label: 'Colour Name', value: 'Black and Grey' },
      { label: 'Cushioning', value: 'Yes' },
      {
        label: 'Key Features',
        value: [
          'Knitted vamp upper for breathability',
          'Support tech outsole for stability',
          'Lace-up closure for a snug fit',
          'Cushioned for comfort',
        ].join(', '),
      },
      { label: 'Material Type', value: 'Mesh' },
      { label: 'Model Name', value: "SYRUS Men's Sports Shoes" },
      { label: 'Occasion', value: 'Sports' },
      { label: 'Product Care Info', value: 'Clean with a dry cloth and mild soapy solution.' },
      { label: 'Product Dimensions', value: '30.5 x 21.5 x 11.2 cm' },
      { label: 'Product Type', value: 'Running Shoes' },
      { label: 'Size', value: 'UK 10' },
      { label: 'Sole Material Type', value: 'Phylon' },
      { label: 'Unit', value: '1' },
    ],
    information: [
      {
        label: 'Disclaimer',
        value:
          'All images are for representational purposes only. It is advised that you read the batch and manufacturing details, directions for use, allergen information, health and nutritional claims (wherever applicable), and other details mentioned on the label before consuming the product. For combo items, individual prices can be viewed on the page.',
      },
      {
        label: 'Customer Care Details',
        value: 'In case of any issue, contact us E-mail address: support@zeptonow.com',
      },
      { label: 'Seller Name', value: 'Commodum Groceries Private Limited' },
      {
        label: 'Seller Address',
        value:
          '2nd Floor, Hirakunj, Plot No 5240, B.B Ghosh Sarani, Vidhyapith RD, Ward 27, Siliguri, Darjeeling, West Bengal, India, Darjeeling, West Bengal-734004',
      },
      { label: 'Seller License No.', value: '12822999000310' },
      { label: 'Country of Origin', value: 'India' },
    ],
  };