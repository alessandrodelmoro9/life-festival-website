export interface Sponsor {
  id: number;
  name: string;
  logo: string;
  category: 
    | 'main' 
    | 'active' 
    | 'community' 
    | 'experience' 
    | 'partner' 
    | 'institutional';
  scale?: number; // Manual compensation for internal padding
}

export const sponsorsData: Sponsor[] = [
  // MAIN SPONSOR - BCC has MASSIVE padding, tuned for final balance
  { id: 1, name: "BCC Basilicata", category: 'main', logo: "/assets/logos/bcc.png", scale: 3.5 },
  
  // ACTIVE SPONSOR
  { id: 2, name: "AIPI", category: 'active', logo: "/assets/logos/aipi.png", scale: 2.0 },
  { id: 3, name: "Grafica Metelliana", category: 'active', logo: "/assets/logos/grafica metelliana@2x.png", scale: 0.7 },
  
  // COMMUNITY E CULTURAL PARTNER
  { id: 4, name: "FM Visual Designer", category: 'community', logo: "/assets/logos/fm@2x.png", scale: 0.8 },
  { id: 5, name: "Etimologia", category: 'community', logo: "/assets/logos/etimologia.png", scale: 2.4 },
  { id: 6, name: "Jupiter", category: 'community', logo: "/assets/logos/jupiter.png", scale: 2.2 },

  // EXPERIENCE SPONSOR - Reduced slightly for better grouping
  { id: 7, name: "Ordine degli Architetti di Potenza", category: 'experience', logo: "/assets/logos/architetti.png", scale: 2.8 },
  { id: 8, name: "MSD Design", category: 'experience', logo: "/assets/logos/msd design.png", scale: 1.8 },
  { id: 9, name: "Basilicata Turistica", category: 'experience', logo: "/assets/logos/apt.png", scale: 2.0 },
  
  // PARTNER
  { id: 10, name: "Zetafonts", category: 'partner', logo: "/assets/logos/ZETA LOGO.png", scale: 1.8 },
  { id: 11, name: "Basic Records", category: 'partner', logo: "/assets/logos/basic.png", scale: 2.0 },
  { id: 12, name: "Overclouds", category: 'partner', logo: "/assets/logos/overclouds.png", scale: 1.8 },
  { id: 13, name: "Autoelite", category: 'partner', logo: "/assets/logos/autoelite.png", scale: 2.2 },
  
  // PATROCINI ISTITUZIONALI - Standardizing scales for uniformity
  { id: 14, name: "ADCI", category: 'institutional', logo: "/assets/logos/adci.png", scale: 2.2 },
  { id: 15, name: "Comune di Potenza", category: 'institutional', logo: "/assets/logos/comune di potenza.png", scale: 2.2 },
  { id: 16, name: "Regione Basilicata", category: 'institutional', logo: "/assets/logos/regione.png", scale: 2.2 },
];
