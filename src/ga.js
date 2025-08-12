// src/ga.js
import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-4BC47FR98L"; // Your GA4 ID

export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const logPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const logEvent = (category, action, label) => {
  ReactGA.event({ category, action, label });
};
