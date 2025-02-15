import { AppointmentStats } from '../data/appointmentStats';

const specialties = [
  'cardiologists',
  'dermatologists',
  'ophthalmologists',
  'psychiatrists',
  'endocrinologists',
  'pediatricians',
  'gynecologists',
  'neurologists',
  'rheumatologists',
  'urologists'
];

const regions = [
  'Ile-De-France',
  'Provence-Alpes-Cote-D-Azur',
  'Auvergne-Rhones-Alpes',
  'Occitanie',
  'Nouvelle-Aquitaine'
];

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateYearlyData(
  year: number,
  specialty: string,
  region: string,
  baseStats: Partial<AppointmentStats>
): AppointmentStats {
  // Add some random variation to base stats
  const variationFactor = 0.2; // 20% variation
  const variation = (base: number) => {
    const range = base * variationFactor;
    return base + (Math.random() * range * 2 - range);
  };

  const prats = Math.floor(variation(baseStats.prats || 500));
  const totalCS = Math.floor(variation(baseStats.total_CS || 1000000));
  const medianWaitDays = Math.floor(variation(baseStats.median_waiting_days_dep || 30));

  // Calculate realistic percentages that sum to 100%
  const share24h = randomBetween(5, 10);
  const share24to48 = randomBetween(2, 5);
  const share48to7d = randomBetween(10, 20);
  const shareMore7d = 100 - (share24h + share24to48 + share48to7d);

  // TCS (teleconsultation) stats
  const clientsTcsPercentage = randomBetween(10, 35);
  const totalTcs = Math.floor(totalCS * (clientsTcsPercentage / 100) * (randomBetween(2, 8) / 100));
  
  return {
    year: `${year}-01-01`,
    practice_region: region,
    specialty,
    concat: `44927${region.toLowerCase().replace(/-/g, '')}${specialty}${year}`,
    prats,
    total_CS: totalCS,
    unique_patients_seen_per_prat_year: Math.floor(totalCS / prats),
    avg_patients_seen_per_month: Math.floor((totalCS / prats) / 12),
    median_waiting_days_dep: medianWaitDays,
    compare_vs_previous_extract: year > 2021 ? `${randomBetween(-15, 5)}%` : null,
    total_appts_booked_48h: Math.floor(totalCS * ((share24h + share24to48) / 100)),
    share_24h: `${share24h}%`,
    share_between_24h_and_48h: `${share24to48}%`,
    share_under_48h: `${share24h + share24to48}%`,
    share_between_48h_and_7d: `${share48to7d}%`,
    share_more_than_7d: `${shareMore7d}%`,
    clients_tcs_percentage: `${clientsTcsPercentage}%`,
    total_tcs: totalTcs,
    median_waiting_days_tcs: randomBetween(2, 7),
    share_tcs_appts_among_clients: `${randomBetween(2, 8)}%`,
    share_tcs_booked_24h: `${randomBetween(15, 35)}%`,
    share_tcs_booked_48h: `${randomBetween(20, 45)}%`
  };
}

export function generateAppointmentStats(startYear = 2021, endYear = 2024): AppointmentStats[] {
  const stats: AppointmentStats[] = [];
  const baseStatsPerSpecialty: Record<string, Partial<AppointmentStats>> = {
    cardiologists: { prats: 700, total_CS: 1600000, median_waiting_days_dep: 28 },
    dermatologists: { prats: 600, total_CS: 1400000, median_waiting_days_dep: 42 },
    ophthalmologists: { prats: 550, total_CS: 1300000, median_waiting_days_dep: 38 },
    psychiatrists: { prats: 850, total_CS: 1600000, median_waiting_days_dep: 32 },
    endocrinologists: { prats: 400, total_CS: 950000, median_waiting_days_dep: 45 },
    pediatricians: { prats: 450, total_CS: 1100000, median_waiting_days_dep: 25 },
    gynecologists: { prats: 600, total_CS: 1400000, median_waiting_days_dep: 35 },
    neurologists: { prats: 350, total_CS: 800000, median_waiting_days_dep: 50 },
    rheumatologists: { prats: 300, total_CS: 700000, median_waiting_days_dep: 40 },
    urologists: { prats: 250, total_CS: 600000, median_waiting_days_dep: 33 }
  };

  // Generate data for each year, specialty, and region
  for (let year = startYear; year <= endYear; year++) {
    for (const specialty of specialties) {
      // Generate more entries for Ile-De-France
      const regionsWithWeight = [
        ...Array(8).fill('Ile-De-France'),
        ...regions.filter(r => r !== 'Ile-De-France')
      ];

      for (const region of regionsWithWeight) {
        stats.push(generateYearlyData(year, specialty, region, baseStatsPerSpecialty[specialty]));
      }
    }
  }

  return stats;
}