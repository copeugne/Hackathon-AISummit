export interface AppointmentStats {
  year: string;
  practice_region: string;
  specialty: string;
  concat: string;
  prats: number;
  total_CS: number;
  unique_patients_seen_per_prat_year: number;
  avg_patients_seen_per_month: number;
  median_waiting_days_dep: number;
  compare_vs_previous_extract: string | null;
  total_appts_booked_48h: number;
  share_24h: string;
  share_between_24h_and_48h: string;
  share_under_48h: string;
  share_between_48h_and_7d: string;
  share_more_than_7d: string;
  clients_tcs_percentage: string;
  total_tcs: number;
  median_waiting_days_tcs: number;
  share_tcs_appts_among_clients: string;
  share_tcs_booked_24h: string;
  share_tcs_booked_48h: string;
}

import { generateAppointmentStats } from '../utils/dataGenerator';

export const appointmentStats = generateAppointmentStats(2021, 2024);