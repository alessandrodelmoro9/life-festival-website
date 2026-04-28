export interface Sponsor {
  id: number;
  name: string;
  logo?: string;
  category: 'experience' | 'active' | 'partner' | 'patron';
  link?: string;
}

export const sponsorsData: Sponsor[] = [
  // EXPERIENCE SPONSORS
  { id: 1, name: "BCC Basilicata", category: 'experience', logo: "/assets/logos/BCC.png" },
  { id: 2, name: "Ordine degli Architetti di Potenza", category: 'experience', logo: "/assets/logos/ordine_architetti.png" },
  { id: 3, name: "MSD Design", category: 'experience', logo: "/assets/logos/MSD.png" },

  // ACTIVE SPONSOR
  { id: 4, name: "AIPI", category: 'active', logo: "/assets/logos/Aipi.png" },

  // PARTNERS
  { id: 5, name: "Zetafonts", category: 'partner', logo: "/assets/logos/zeta.png" },
  { id: 6, name: "FM Visual Designer", category: 'partner', logo: "/assets/logos/logo fm.png" },
  { id: 7, name: "Overclouds", category: 'partner', logo: "/assets/logos/overclouds.png" },
  { id: 8, name: "Basic Records", category: 'partner', logo: "/assets/logos/Basic.png" },
  { id: 9, name: "Abana", category: 'partner', logo: "/assets/logos/abana.png" },
  { id: 10, name: "Progetto 131", category: 'partner', logo: "/assets/logos/progetto131.png" },
  { id: 11, name: "Heflies", category: 'partner', logo: "/assets/logos/heflies.png" },
  { id: 12, name: "TAM", category: 'partner', logo: "/assets/logos/logo tam.png" },
  { id: 13, name: "Cosystem", category: 'partner', logo: "/assets/logos/cosystem.png" },

  // PATROCINI
  { id: 14, name: "ADCI", category: 'patron', logo: "/assets/logos/ADCI.png" },
  { id: 15, name: "Comune di Potenza", category: 'patron', logo: "/assets/logos/comune_potenza.png" }
];
