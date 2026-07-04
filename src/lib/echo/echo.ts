/* eslint-disable @typescript-eslint/no-unused-vars */
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import axios, { type AxiosResponse } from "axios";

console.log("=== DEBUG 1: echo.ts file is loaded successfully! ===");

// Enable Pusher logging to see internal logs
(window as any).Pusher = Pusher;
Pusher.logToConsole = true;

// Check if ENV variables are actually loading
// console.log("=== DEBUG 2: Checking ENV Variables ===");
// console.log("HOST:", import.meta.env.VITE_REVERB_HOST);
// console.log("PORT:", import.meta.env.VITE_REVERB_PORT);
// console.log("SCHEME:", import.meta.env.VITE_REVERB_SCHEME);
// console.log("AUTH ENDPOINT:", import.meta.env.VITE_BROADCAST_AUTH_ENDPOINT);

const reverbHost = import.meta.env.VITE_REVERB_HOST || "10.10.28.53";
const authEndpoint =
  import.meta.env.VITE_BROADCAST_AUTH_ENDPOINT ||
  "https://api.lovelysmealplans.com/api/broadcasting/auth";
const reverbAppKey =
  import.meta.env.VITE_REVERB_APP_KEY || "oskghldeokkdfjdslhnfd";
const isTls = import.meta.env.VITE_REVERB_SCHEME === "https";

// console.log("=== DEBUG 3: Final Echo Config ===", {
//   reverbHost,
//   reverbPort,
//   isTls,
//   authEndpoint,
// });

const echo = new Echo({
  broadcaster: "reverb",
  key: reverbAppKey,
  wsHost: reverbHost,
  wsPort: 80,
  wssPort: 443,
  forceTLS: isTls,
  enabledTransports: ['ws', 'wss'],
  authEndpoint: authEndpoint,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  },
});

// This is the ultimate test: It will fire on ANY connection state change
echo.connector.pusher.connection.bind("state_change", function () {});

export default echo;
