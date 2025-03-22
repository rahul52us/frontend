// import { useState } from 'react';

// function GetCurrentLocation() {
//   const [loading, setLoading] = useState(false);

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           console.log("Exact GPS Coordinates:", { latitude, longitude });

//           // Now fetch the detailed address using OpenStreetMap
//           fetch(`https://nominatim.openstreetmap.org/reverse?lat=${19.125885}&lon=${72.9996432}&format=json`)
//             .then((response) => response.json())
//             .then((data) => {
//               console.log("Precise Location:", data.display_name);
//             })
//             .catch((error) => console.error("Error fetching address:", error));
//         },
//         (error) => {
//           console.error("Geolocation Error:", error.message);
//         },
//         { enableHighAccuracy: true } // This ensures precise GPS location
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };

//   // Call the function
//   getCurrentLocation();



//   return (
//     <div style={{ padding: '20px' }}>
//       <button onClick={getCurrentLocation} disabled={loading}>
//         {loading ? 'Fetching...' : 'Get My Location'}
//       </button>
//     </div>
//   );
// }

// export default GetCurrentLocation;

const GetCurrentLocation = () => {
  return (
    <div>GetCurrentLocation</div>
  )
}

export default GetCurrentLocation