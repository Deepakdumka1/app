import { useState, useEffect } from 'react';

const useStats = () => {
  const [stats, setStats] = useState({
    users: 0,
    groups: 0,
    resources: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Simulated API call - replace with actual API endpoint
      const response = {
        users: Math.floor(1000 + Math.random() * 500),
        groups: Math.floor(50 + Math.random() * 20),
        resources: '24/7'
      };
      setStats(response);
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return stats;
};

export default useStats; 