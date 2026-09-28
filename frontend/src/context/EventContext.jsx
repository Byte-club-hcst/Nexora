import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const EventContext = createContext(null);

export function EventProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [configRes, tracksRes, announcementsRes] = await Promise.all([
        api.get('/api/event/config').catch(() => ({ data: { config: null } })),
        api.get('/api/tracks').catch(() => ({ data: { tracks: [] } })),
        api.get('/api/event/announcements').catch(() => ({ data: { announcements: [] } })),
      ]);

      if (configRes?.data?.config) {
        setConfig(configRes.data.config);
      }
      if (tracksRes?.data?.tracks) {
        setTracks(tracksRes.data.tracks);
      }
      if (announcementsRes?.data?.announcements) {
        setAnnouncements(announcementsRes.data.announcements);
      }
    } catch (err) {
      console.error('[EventContext] Error fetching event data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Format any UTC ISO string to Asia/Kolkata (IST) display format
   */
  const formatIST = (isoString, options = {}) => {
    if (!isoString) return 'TBA';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: options.hideTime ? undefined : '2-digit',
        minute: options.hideTime ? undefined : '2-digit',
        hour12: true,
        ...options,
      }).format(date);
    } catch {
      return isoString;
    }
  };

  const value = {
    config,
    announcements,
    tracks,
    loading,
    error,
    formatIST,
    refreshConfig: fetchData,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEvent() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}
