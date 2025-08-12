// // src/hooks/useMatches.js
// import { useState, useEffect } from "react";
// import axios from "axios";

// const BASE_URL = "http://localhost:5000/api";

// export const useMatches = (filters) => {
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMatches = async () => {
//       setLoading(true);
//       try {
//         const { league, date, search } = filters;

//         const response = await axios.get(`${BASE_URL}/matches`, {
//           params: {
//             league_id: league,
//             date: date,
//           },
//         });

//         let result = response.data.data || [];

//         // Optional search filter
//         if (search) {
//           result = result.filter(
//             (m) =>
//               m.home.name.toLowerCase().includes(search.toLowerCase()) ||
//               m.away.name.toLowerCase().includes(search.toLowerCase())
//           );
//         }

//         // Transform result into usable format
//         const formatted = result.map((m) => ({
//           homeTeam: m.home.name,
//           awayTeam: m.away.name,
//           homeLogo: m.home.logo,
//           awayLogo: m.away.logo,
//           time: m.time.starting_at.date_time,
//           league: m.league.name,
//           leagueLogo: m.league.logo,
//           prediction: "Coming soon",
//           type: "free", // default for now
//         }));

//         setMatches(formatted);
//       } catch (err) {
//         console.error("Failed to fetch matches:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMatches();
//   }, [filters]);

//   return { matches, loading };
// };
