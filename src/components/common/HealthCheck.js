import React, { useEffect, useState } from 'react';
import { Alert } from 'antd';
import { checkBackendHealth } from '../../services/healthCheck';

function HealthCheck() {
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      const status = await checkBackendHealth();
      setHealthStatus(status);
    };

    // 初始检查
    checkHealth();

    // 每30秒检查一次
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!healthStatus) {
    return null;
  }

  return (
    <Alert
      message={healthStatus.message}
      type={healthStatus.isHealthy ? 'success' : 'error'}
      showIcon
      style={{
        position: 'fixed',
        top: '60px',
        right: '20px',
        zIndex: 1000,
        maxWidth: '300px'
      }}
    />
  );
}

export default HealthCheck; 