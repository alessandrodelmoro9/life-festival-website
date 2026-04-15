export interface Sponsor {
  id: number;
  name: string;
  logo?: string;
  category: 'main' | 'partner' | 'patron';
  link?: string;
}

export const sponsorsData: Sponsor[] = [
  // MAIN SPONSORS
  { id: 1, name: "MSD design", category: 'main', logo: "/loghi_sponsor/MSD.png" },
  { id: 2, name: "Avena", category: 'main' }, // Mancante
  { id: 3, name: "BCC", category: 'main', logo: "/loghi_sponsor/BCC.png" },
  { id: 4, name: "Ordine degli Architetti di Potenza", category: 'main', logo: "/loghi_sponsor/ordine architetti.jpeg" },
  { id: 5, name: "Zetafonts", category: 'main', logo: "/loghi_sponsor/zeta.png" },
  { id: 6, name: "Aipi", category: 'main', logo: "/loghi_sponsor/Aipi.png" },

  // PATROCINI
  { id: 7, name: "IDD", category: 'patron' }, // Mancante
  { id: 8, name: "ADI", category: 'patron' }, // Mancante
  { id: 9, name: "ADCI", category: 'patron', logo: "/loghi_sponsor/ADCI.png" },

  // PARTNERS
  { id: 10, name: "Open sound festival", category: 'partner', logo: "/loghi_sponsor/open sound.png" },
  { id: 11, name: "FM visual designer", category: 'partner', logo: "/loghi_sponsor/logo fm.png" },
  { id: 12, name: "Basic Records", category: 'partner', logo: "/loghi_sponsor/Basic.png" },
  { id: 13, name: "ABANA", category: 'partner', logo: "/loghi_sponsor/abana.png" },
  { id: 14, name: "Progetto131", category: 'partner' }, // Mancante
  { id: 15, name: "TAM", category: 'partner', logo: "/loghi_sponsor/logo tam.png" },
  { id: 16, name: "Cosystem", category: 'partner' } // Mancante
];
