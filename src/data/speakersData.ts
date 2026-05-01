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
    id: 0,
    name: "Samuela Vaccari aka Cromia Design",
    role: "HOST",
    description: "Designer e curatrice, guiderà il racconto di LIFE Design Festival 2026.",
    color: 'primary',
    image: "/assets/speakers/Cromia design_samuela vaccari.jpg"
  },
  {
    id: 1,
    name: "Adoratorio studio",
    role: "Digital Design Studio",
    description: "Esperienze digitali tra arte e tecnologia d'avanguardia.",
    color: 'primary',
    image: "/assets/speakers/adoratorio studio.jpg"
  },
  {
    id: 2,
    name: "Auge",
    role: "Independent Agency",
    description: "Brand identity e comunicazione strategica ad alto impatto.",
    color: 'secondary',
    image: "/assets/speakers/Auge.jpg"
  },
  {
    id: 3,
    name: "BeFamily",
    role: "Communication Studio",
    description: "Progettazione di connessioni e narrazioni visive contemporanee.",
    color: 'accent',
    image: "/assets/speakers/Be Family.jpg"
  },
  {
    id: 4,
    name: "Brutto Studio",
    role: "Design Collective",
    description: "Sperimentazione visiva e approccio grafico non convenzionale.",
    color: 'primary',
    image: "/assets/speakers/bruttoStudio.jpg"
  },
  {
    id: 5,
    name: "Dude Agency",
    role: "Creative Agency",
    description: "Hub creativo tra pubblicità e intrattenimento internazionale.",
    color: 'secondary',
    image: "/assets/speakers/Domenico LoperfidoDUDE.jpg"
  },
  {
    id: 6,
    name: "dverso studio",
    role: "Visual Communication",
    description: "Motion design e innovazione dei linguaggi digitali.",
    color: 'accent',
    image: "/assets/speakers/Dverso studio.jpg"
  },
  {
    id: 7,
    name: "Ego55",
    role: "Creative Factory",
    description: "Trasformazione dei brand attraverso strategie creative audaci.",
    color: 'primary',
    image: "/assets/speakers/ego55.jpg"
  },
  {
    id: 8,
    name: "ET STUDIO",
    role: "Design & Identity",
    description: "Identità visive forti e sistemi di design integrati.",
    color: 'secondary',
    image: "/assets/speakers/EtStudio.jpg"
  },
  {
    id: 9,
    name: "Italo Sannino",
    role: "UX Expert & Figma Master",
    description: "Pioniere della UX e formatore specializzato in interfacce.",
    color: 'accent',
    image: "/assets/speakers/italo_sannino.jpg"
  },
  {
    id: 10,
    name: "Jekyll & Hyde",
    role: "Strategic Design Studio",
    description: "Rigore strategico e follia creativa applicata al progetto.",
    color: 'primary',
    image: "/assets/speakers/Jekyll & Hyde.jpg"
  },
  {
    id: 11,
    name: "Mauro Bubbico",
    role: "Graphic Designer",
    description: "Fonde tradizione popolare e ricerca visiva contemporanea.",
    color: 'secondary',
    image: "/assets/speakers/Mauro Bubbico.jpg"
  },
  {
    id: 12,
    name: "Mauro Mazzei",
    role: "Creative Director",
    description: "Comunicazione pubblicitaria e direzione creativa di alto livello.",
    color: 'accent',
    image: "/assets/speakers/Mauro-Mazzei.jpg"
  },
  {
    id: 13,
    name: "Enrica D’Aguanno",
    role: "Professoressa & Academic",
    description: "Docente e ricercatrice sull'evoluzione dei linguaggi visivi.",
    color: 'secondary',
    image: "/assets/speakers/enricadaguanno.jpg"
  },
  {
    id: 14,
    name: "PUG!",
    role: "Creative Network",
    description: "Illustrazione, design e cultura visuale pop contemporanea.",
    color: 'accent',
    image: "/assets/speakers/pug design fest.jpg"
  },
  {
    id: 15,
    name: "Rocket Panda",
    role: "Motion Design Studio",
    description: "Animazione e storytelling dinamico per idee in movimento.",
    color: 'primary',
    image: "/assets/speakers/Riccardo Albertini (Rocketpanda).jpg"
  },
  {
    id: 16,
    name: "Silvia Sguotti",
    role: "Visual Artist",
    description: "Indagine sul rapporto tra materia, segno e spazio visivo.",
    color: 'secondary',
    image: "/assets/speakers/silvia sguotti.jpg"
  },
  {
    id: 17,
    name: "Simone Checchia",
    role: "Creative Director",
    description: "Design di prodotto tra estetica funzionale e innovazione.",
    color: 'accent',
    image: "/assets/speakers/SimoneChecchia.jpg"
  },
  {
    id: 18,
    name: "The Wave",
    role: "Creative Production",
    description: "Contenuti visivi d'avanguardia tra tecnologia e visione.",
    color: 'primary',
    image: "/assets/speakers/The wave.jpg"
  },
  {
    id: 19,
    name: "Zetafonts",
    role: "Type Foundry",
    description: "Fonderia tipografica tra le più influenti a livello mondiale.",
    color: 'secondary',
    image: "/assets/speakers/zeta fonts.jpg"
  }
];
