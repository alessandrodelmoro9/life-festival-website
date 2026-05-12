export interface Sponsor {
  id: number;
  name: string;
  logo: string;
  url?: string;
  category: 
    | 'top'
    | 'main' 
    | 'active' 
    | 'community' 
    | 'experience' 
    | 'partner' 
    | 'institutional';
}

export const sponsorsData: Sponsor[] = [
  // MAIN SPONSOR (TOP)
  { id: 17, name: "La Gala Home", category: 'top', logo: "/assets/logos/la-gala-home.png" },

  // CON IL SOSTEGNO DEL FONDO ETICO DI
  { id: 1, name: "BCC Basilicata", category: 'main', logo: "/assets/logos/bcc.png" },

  // ACTIVE SPONSOR
  { id: 2, name: "AIPI", category: 'active', logo: "/assets/logos/aipi.png" },
  { id: 3, name: "Grafica Metelliana", category: 'active', logo: "/assets/logos/grafica-m.png" },

  // COMMUNITY E CULTURAL PARTNER
  { id: 4, name: "FM Visual Designer", category: 'community', logo: "/assets/logos/fm.png" },
  { id: 5, name: "Etimologia", category: 'community', logo: "/assets/logos/etmiologia.png" },
  { id: 6, name: "Jupiter", category: 'community', logo: "/assets/logos/jupiter.png" },

  // EXPERIENCE SPONSOR
  { id: 7, name: "Ordine degli Architetti di Potenza", category: 'experience', logo: "/assets/logos/ordine-architetti.png" },
  { id: 8, name: "MSD Design", category: 'experience', logo: "/assets/logos/msd.png" },
  { id: 9, name: "Basilicata Turistica", category: 'experience', logo: "/assets/logos/apt.png" },

  // PARTNER
  { id: 10, name: "Zetafonts", category: 'partner', logo: "/assets/logos/zetafont.png" },
  { id: 11, name: "Basic Records", category: 'partner', logo: "/assets/logos/basic.png" },
  { id: 12, name: "Overclouds", category: 'partner', logo: "/assets/logos/overclouds.png" },
  { id: 13, name: "Autoelite", category: 'partner', logo: "/assets/logos/autoelite.png" },

  // PATROCINI ISTITUZIONALI
  { id: 14, name: "ADCI", category: 'institutional', logo: "/assets/logos/adci.png" },
  { id: 15, name: "Comune di Potenza", category: 'institutional', logo: "/assets/logos/comune.png" },
  { id: 16, name: "Regione Basilicata", category: 'institutional', logo: "/assets/logos/regione.png" },
];
