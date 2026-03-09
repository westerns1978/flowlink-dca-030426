
export const API_CONFIG = {
  baseUrl: "https://crickets-c2-dca-286939318734.us-west1.run.app",
  endpoints: {
    root: "/",
    health: "/api/health",
    status: "/api/status",
    fleet: "/api/fleet",
    billing: "/api/billing",
    revenue: "/api/revenue-projection",
    activity: "/api/activity-feed",
    opportunities: "/api/opportunities",
    mcp: "/mcp"
  },
  billing: {
    pollIntervalMs: 60000,
    timeoutMs: 5000,
    retryAttempts: 3,
    endpoints: {
      usage: '/billing/v1/usage'
    }
  },
  polling: {
    fleet: 10000,
    revenue: 30000,
    activity: 5000,
    opportunities: 60000
  }
};

export default API_CONFIG;
