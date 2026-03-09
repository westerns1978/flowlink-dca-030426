export const API_CONFIG = {
  baseUrl: "https://crickets-c2-dca-286939318734.us-west1.run.app",
  endpoints: {
    root: "/",
    health: "/api/health",
    status: "/api/status",
    fleet: "/api/fleet",
    billing: "/api/billing", // + /{customer_id}
    revenue: "/api/revenue-projection",
    activity: "/api/activity-feed",
    opportunities: "/api/opportunities",
    mcp: "/mcp"
  },
  polling: {
    fleet: 10000,        // 10 seconds
    revenue: 30000,      // 30 seconds
    activity: 5000,      // 5 seconds (live feed)
    opportunities: 60000 // 60 seconds
  }
};

export default API_CONFIG;
