import { useState, useEffect, useCallback } from 'react';
import dcaApi, { FleetResponse, RevenueResponse, ActivityItem, OpportunityItem } from '../services/dcaApi';
import API_CONFIG from '../config/api';

// Hook for fleet data with auto-refresh
export function useFleet(autoRefresh = true) {
  const [data, setData] = useState<FleetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // Don't set loading true on background refreshes to avoid UI flicker
      if (!data) setLoading(true); 
      
      const result = await dcaApi.getFleet();
      setData(result);
      setError(null);
    } catch (err) {
      console.error("Fleet API Error:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    fetchData();
    if (autoRefresh) {
      const interval = setInterval(fetchData, API_CONFIG.polling.fleet);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchData]);

  return { data, loading, error, refresh: fetchData };
}

// Hook for revenue projection
export function useRevenue(autoRefresh = true) {
  const [data, setData] = useState<RevenueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      if (!data) setLoading(true);
      const result = await dcaApi.getRevenueProjection();
      setData(result);
      setError(null);
    } catch (err) {
      console.error("Revenue API Error:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    fetchData();
    if (autoRefresh) {
      const interval = setInterval(fetchData, API_CONFIG.polling.revenue);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchData]);

  return { data, loading, error, refresh: fetchData };
}

// Hook for activity feed
export function useActivityFeed(autoRefresh = true) {
  const [data, setData] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      if (data.length === 0) setLoading(true);
      const result = await dcaApi.getActivityFeed();
      // Handle both array response or object wrapper
      if (Array.isArray(result)) {
        setData(result);
      } else if (result && Array.isArray(result.activities)) {
        setData(result.activities);
      }
      setError(null);
    } catch (err) {
      console.error("Activity API Error:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [data.length]);

  useEffect(() => {
    fetchData();
    if (autoRefresh) {
      const interval = setInterval(fetchData, API_CONFIG.polling.activity);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchData]);

  return { data, loading, error, refresh: fetchData };
}

// Hook for opportunities
export function useOpportunities(autoRefresh = true) {
  const [data, setData] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      if (data.length === 0) setLoading(true);
      const result = await dcaApi.getOpportunities();
      if (Array.isArray(result)) {
        setData(result);
      }
      setError(null);
    } catch (err) {
      console.error("Opportunities API Error:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [data.length]);

  useEffect(() => {
    fetchData();
    if (autoRefresh) {
      const interval = setInterval(fetchData, API_CONFIG.polling.opportunities);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchData]);

  return { data, loading, error, refresh: fetchData };
}
