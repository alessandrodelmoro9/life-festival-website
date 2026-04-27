export interface Sponsor {
  id: number;
  name: string;
  logo?: string;
  category: 'experience' | 'active' | 'partner' | 'patron';
  link?: string;
}

export const sponsorsData: Sponsor[] = [
  // EXPERIENCE SPONSORS
  { id: 1, name: "BCC Basilicata", category: 'experience', logo: "/loghi_sponsor/BCC.png" },
  { id: 2, name: "Ordine degli Architetti di Potenza", category: 'experience', logo: "/loghi_sponsor/ordine_architetti.png" },
  { id: 3, name: "MSD Design", category: 'experience', logo: "/loghi_sponsor/MSD.png" },

  // ACTIVE SPONSOR
  { id: 4, name: "AIPI", category: 'active', logo: "/loghi_sponsor/Aipi.png" },

  // PARTNERS
  { id: 5, name: "Zetafonts", category: 'partner', logo: "/loghi_sponsor/zeta.png" },
  { id: 6, name: "FM Visual Designer", category: 'partner', logo: "/loghi_sponsor/logo fm.png" },
  { id: 7, name: "Overclouds", category: 'partner', logo: "/loghi_sponsor/overclouds.png" },
  { id: 8, name: "Basic Records", category: 'partner', logo: "/loghi_sponsor/Basic.png" },
  { id: 9, name: "Abana", category: 'partner', logo: "/loghi_sponsor/abana.png" },
  { id: 10, name: "Progetto 131", category: 'partner', logo: "/loghi_sponsor/progetto131.png" },
  { id: 11, name: "Heflies", category: 'partner', logo: "/loghi_sponsor/heflies.png" },
  { id: 12, name: "TAM", category: 'partner', logo: "/loghi_sponsor/logo tam.png" },
  { id: 13, name: "Cosystem", category: 'partner', logo: "/loghi_sponsor/cosystem.png" },

  // PATROCINI
  { id: 14, name: "ADCI", category: 'patron', logo: "/loghi_sponsor/ADCI.png" },
  { id: 15, name: "Comune di Potenza", category: 'patron', logo: "/loghi_sponsor/comune_potenza.png" }
];
