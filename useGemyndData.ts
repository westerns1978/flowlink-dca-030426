
import { useState, useEffect } from 'react';

export const useGemyndData = () => {
  const [systemStatus] = useState<string>('OPERATIONAL');
  const [isKatieReady] = useState<boolean>(true);
  const [fleetCount] = useState<number>(9);
  
  return { systemStatus, isKatieReady, fleetCount, alerts: [], services: [] };
};
