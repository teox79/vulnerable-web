import axios from "axios";

import { ANALYTICS_API_TOKEN, API_BASE_URL } from "./config";

/** Sends an analytics event to the backend. */
export function track(event: string) {
  return axios.post(
    `${API_BASE_URL}/track`,
    { event },
    { headers: { Authorization: `Bearer ${ANALYTICS_API_TOKEN}` } },
  );
}
