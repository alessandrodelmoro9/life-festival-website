export interface Speaker {
  id: number;
  name: string;
  role: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
  image?: string;
  socials?: {
    instagram?: string;
    linkedin?: string;
  };
}

export const speakersData: Speaker[] = [
  {
    id: 1,
    name: "Mario Moroni",
    role: "Podcaster",
    description: "Gestisce il podcast 'Il caffettino', punto di riferimento per l'innovazione digitale in Italia.",
    color: 'primary',
    socials: { instagram: "", linkedin: "" }
  },
  {
    id: 2,
    name: "Caffè Design",
    role: "Creator / Collettivo",
    description: "Esplorano il mondo del progetto con quiz, intrattenimento e una visione dissacrante del design.",
    color: 'secondary',
    socials: { instagram: "", linkedin: "" }
  },
  {
    id: 3,
    name: "Monogrid",
    role: "Digital Production Company",
    description: "Valentina Trevisanello e Marco Trevisani portano l'innovazione tecnologica nel mindset creativo.",
    color: 'accent',
    socials: { instagram: "", linkedin: "" }
  },
  {
    id: 4,
    name: "Alessandra Marin",
    role: "Designer @ Illo",
    description: "Esplora l'imprevisto creativo e l'animazione d'avanguardia all'interno dello studio Illo.",
    color: 'primary',
    socials: { instagram: "", linkedin: "" }
  },
  {
    id: 5,
    name: "Cosimo Lorenzo Pacini",
    role: "Type Designer @ Zetafonts",
    description: "Gestisce una delle fonderie tipografiche italiane più influenti a livello internazionale.",
    color: 'secondary',
    socials: { instagram: "", linkedin: "" }
  },
  {
    id: 6,
    name: "Matteo Roversi",
    role: "Relatore @ Cosmico",
    description: "Si occupa di nuove visioni lavorative e della connessione tra talenti e aziende nel mondo tech.",
    color: 'accent',
    socials: { instagram: "", linkedin: "" }
  },
  {
    id: 7,
    name: "Dario Volpe",
    role: "Designer @ Lettera7",
    description: "Analizza criticamente i loghi e l'identità visiva con un approccio analitico e colto.",
    color: 'primary',
    socials: { instagram: "", linkedin: "" }
  },
  {
    id: 8,
    name: "Pietro Spagnolo",
    role: "Business Designer @ SUBSENSE",
    description: "Gestisce e progetta il business creativo, unendo strategia e design thinking.",
    color: 'secondary',
    socials: { instagram: "", linkedin: "" }
  },
  {
    id: 9,
    name: "Lorenzo Grosso",
    role: "Designer @ The Rabbix",
    description: "Focalizzato sulla manualità e sull'importanza del 'fare con le mani' nel processo creativo.",
    color: 'accent',
    socials: { instagram: "", linkedin: "" }
  },
  {
    id: 10,
    name: "Giuseppe Giurlando",
    role: "Creative Director @ Sangria",
    description: "Valorizza le radici creative mediterranee portandole in una dimensione contemporanea.",
    color: 'primary',
    socials: { instagram: "", linkedin: "" }
  },
  {
    id: 11,
    name: "Silvio Giordano",
    role: "Artista & Designer",
    description: "Sperimenta costantemente tra tecniche analogiche, videoarte e intelligenza artificiale.",
    color: 'secondary',
    socials: { instagram: "", linkedin: "" }
  },
  {
    id: 12,
    name: "Valerio Calabrese",
    role: "AI Consultant",
    description: "Analizza l'evoluzione dell'IA e il suo impatto sociale e professionale nel mondo del design.",
    color: 'accent',
    socials: { instagram: "", linkedin: "" }
  },
  {
    id: 13,
    name: "Mauro Mazzei",
    role: "ADV Specialist",
    description: "Analizza l'industria pubblicitaria moderna tra dati, creatività e nuovi media.",
    color: 'primary',
    socials: { instagram: "", linkedin: "" }
  },
  {
    id: 14,
    name: "Matteo Marchesano",
    role: "Experience Designer",
    description: "Crea progetti memorabili focalizzati sull'utente e sull'emozione dell'esperienza.",
    color: 'secondary',
    socials: { instagram: "", linkedin: "" }
  },
  {
    id: 15,
    name: "District",
    role: "Designer Network",
    description: "Gestisce una rete capillare per designer, facilitando connessioni e opportunità professionali.",
    color: 'accent',
    socials: { instagram: "", linkedin: "" }
  },
  {
    id: 16,
    name: "17studio",
    role: "Audiovisual Performers",
    description: "WeLikeTheFish & Bob Vito curano la parte sonora e visuale con performance immersive.",
    color: 'primary',
    socials: { instagram: "", linkedin: "" }
  }
];
