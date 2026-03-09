
import { BillingDelta } from '../types';

export interface RWUBreakdown {
  cptt: number;
  cpt: number;
  cplf: number;
  total: number;
}

/**
 * RWU Calculation Engine
 * Maps twAIn Billing API deltas to ERP-standard units.
 */
export const calculateRWUFromBillingDelta = (delta: BillingDelta): RWUBreakdown => {
  const cptt = delta.time_delta_hours * 15.00;        // $15/hr
  const cpt = delta.tasks_delta * 2.50;               // $2.50/task
  const cplf = (delta.distance_delta_m * 3.28084) * 0.05; // $0.05/linear foot

  return {
    cptt,
    cpt,
    cplf,
    total: cptt + cpt + cplf
  };
};
