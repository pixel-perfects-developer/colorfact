// import axios from "axios";
// import https from "https";

// export const customAxios = axios.create({
//   httpsAgent: new https.Agent({
//     rejectUnauthorized: false, // ⚠️ Only use this in dev environments
//   }),
//   // 👇 Default headers — clean and flexible
//   headers: {
//     Accept: "application/json",
//   },
// });

// // ✅ Allow Axios to handle FormData uploads correctly
// customAxios.interceptors.request.use((config) => {
//   // Remove manually set Content-Type for FormData
//   if (config.data instanceof FormData) {
//     delete config.headers["Content-Type"];
//   }
//   return config;
// });

// export default customAxios;
import axios from "axios";

export const customAxios = axios.create({
  headers: {
    Accept: "application/json",
  },
});
