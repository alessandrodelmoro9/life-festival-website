export interface Speaker {
  id: number;
  name: string;
  role: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
  image?: string;
  instagram?: string;
  website?: string;
}

export const speakersData: Speaker[] = [
  {
    id: 0,
    name: "Cromia Design",
    role: "Graphic designer - Host",
    description: "Samuela Vaccari è graphic designer e fondatrice di Cromia Design. Si occupa di brand identity, sviluppando identità visive basate su ricerca, coerenza e attenzione alle scelte progettuali. Il suo lavoro è orientato a costruire sistemi chiari e riconoscibili nel tempo.",
    color: 'primary',
    image: "/assets/speakers/Cromia design_samuela vaccari.jpg",
    instagram: "https://www.instagram.com/cromiadesign/",
    website: "https://cromiadesign.myportfolio.com"
  },
  {
    id: 1,
    name: "Adoratorio Studio",
    role: "Independent Design Studio",
    description: "Ciarli e Riccardo, Design Lead e Junior Art Director in Adoratorio Studio, immaginano progetti simbiotici di design consapevole, inclusivo e rilevante tramite linguaggi visivi contemporanei, ricerca di nicchia e sensibilità personale.",
    color: 'primary',
    image: "/assets/speakers/adoratorio studio.jpg",
    instagram: "https://www.instagram.com/adoratorio.studio",
    website: "https://www.adoratorio.studio"
  },
  {
    id: 2,
    name: "AUGE Design",
    role: "Independent Studio",
    description: "Andrea Mastroluca è Associate Creative Director in Auge Design, studio specializzato in Packaging Design e Branding. In oltre 10 anni di carriera ha collaborato con brand come Barilla, Chobani e Rana, ottenendo prestigiosi award internazionali tra cui ADC, D&AD e Pentawards. Sotto la sua guida, Auge Design è stata premiata come Dieline Studio of the Year 2022 e Pentawards Agency of the Year 2023.",
    color: 'secondary',
    image: "/assets/speakers/Auge.jpg",
    instagram: "https://www.instagram.com/auge_d/",
    website: "https://www.auge-design.com"
  },
  {
    id: 3,
    name: "Be.Family",
    role: "Studio di comunicazione digitale",
    description: "Pierfilippo Ariano, classe ’91. Parte dal design della comunicazione, poi si complica la vita studiando anche web marketing, più per capire come funzionano le cose che per amore della materia. Dopo qualche anno da freelance, nel 2016 fonda Be.Family: uno studio che lavora da remoto quando ancora non era “di moda”, occupandosi di progetti digitali senza separare design, sviluppo e comunicazione. Tra il 2019 e il 2021 collabora con Sketch nell’organizzazione di eventi sul design e dal 2020 insegna UI/UX design tra università e aziende (IED, IUSVE e altri), cercando di spiegare agli studenti che il problema non è usare Figma, ma capire cosa stanno facendo e perché.",
    color: 'accent',
    image: "/assets/speakers/Be Family.jpg",
    instagram: "https://www.instagram.com/befamily_studio/",
    website: "https://www.befamily.it"
  },
  {
    id: 4,
    name: "Brutto Studio",
    role: "Independent Studio",
    description: "Brutto è uno studio di design fondato da Marco Oggian e Samuel Canay, con base tra l'Italia e la Galizia. Nata come realtà di progettazione per clienti terzi come Reebok, Zara e gruppo Meliá Hotels, oggi Brutto è prima di tutto una marca: un catalogo di oggetti carichi di cultura visiva, ironia e riferimenti che attraversano grafica, musica e sport. Lavorano su scala internazionale con una produzione che spazia dall'oggettistica alle stampe d'arte, tutti accomunati da un linguaggio riconoscibile e volutamente controcorrente. Brutto opera alla frontiera tra oggetto e comunicazione, convinti che il design ben fatto non abbia bisogno di spiegarsi.",
    color: 'primary',
    image: "/assets/speakers/bruttoStudio.jpg",
    instagram: "https://www.instagram.com/brutto.studio/",
    website: "https://www.brutto.shop"
  },
  {
    id: 5,
    name: "DUDE Design",
    role: "Independent Agency",
    description: "Domenico Loperfido nasce a Noci e, per quanto indossi uno dei cognomi più comuni della Basilicata, è un pugliese trapiantato a Milano per lavoro. Da più di 10 anni nel mondo del marketing e della creatività, oggi è CEO e Partner di DUDE Design, la divisione del gruppo dedicata a branding e visual identity. È anche Chief Growth Officer di DUDE, dove guida le strategie di crescita del gruppo e si occupa di far succedere cose belle. Dal 2023 cura la newsletter In Case You Missed It, dedicata a marketing, advertising, design e cultura pop.",
    color: 'secondary',
    image: "/assets/speakers/Domenico LoperfidoDUDE.jpg",
    instagram: "https://www.instagram.com/dude_frames/",
    website: "https://www.dude.it"
  },
  {
    id: 6,
    name: "dverso studio",
    role: "Creative studio",
    description: "Dverso è uno studio creativo con sede a Milano, specializzato nella progettazione e sviluppo di esperienze digitali immersive e interattive. Riconosciuto a livello internazionale con Awwwards Site of the Day, Developer Award, Portfolio Honors, e Muzli Top 100 Creative Portfolios 2025.",
    color: 'accent',
    image: "/assets/speakers/Dverso studio.jpg",
    instagram: "https://www.instagram.com/dverso.io/",
    website: "https://www.dversostudio.io"
  },
  {
    id: 7,
    name: "EGO55",
    role: "Branding studio",
    description: "EGO55 è uno studio di branding, design e comunicazione integrata, nato a Matera nel 2011, con la voglia di ripartire dal Sud, dalla propria città di origine per sognare un mondo dove il branding aiutasse le imprese a raccontare la propria storia. Sviluppa progetti multidisciplinari e personalizzati, con un approccio design focused, per rendere i brand impattanti, differenti e desiderabili con l'obiettivo di migliorare la percezione attraverso le giuste strategie, parole e soluzioni visive. EGO55 è un luogo di pensiero. Un laboratorio di idee in cui la filosofia incontra il business, e l’arte incontra la strategia. Il branding è un atto di responsabilità, un modo per fare impresa con ambizione.",
    color: 'primary',
    image: "/assets/speakers/ego55.jpg",
    instagram: "https://www.instagram.com/ego55_branding_studio/",
    website: "https://www.ego55.com"
  },
  {
    id: 8,
    name: "ET Studio",
    role: "Independent Extraterrestrial Studio",
    description: "ET Studio è uno studio indipendente che crede nel potere della bellezza. Unisce design, branding e scrittura per creare esperienze digitali in cui estetica e funzionalità convivono. Nasce da un background tra arti e discipline umanistiche e lavora in team piccoli, dove il confronto è diretto e continuo.",
    color: 'secondary',
    image: "/assets/speakers/EtStudio.jpg",
    instagram: "https://www.instagram.com/et__studio/",
    website: "https://www.e-t.studio"
  },
  {
    id: 9,
    name: "Italo Sannino",
    role: "Design Professor & Product/UI/UX Designer",
    description: "Italo Sannino è progettista, docente e ricercatore. Titolare della cattedra di Progettazione delle Interfacce, da vent'anni porta il design nelle aule accademiche con un approccio sistemico e fondato sul metodo. Lavora su design system, usabilità e intelligenza artificiale applicata alla progettazione. Figma Community Leader e Adobe Community Expert, è stato speaker in contesti globali come Adobe MAX. Membro del collegio di dottorato dell'Università di Foggia, integra costantemente il design nel mondo della ricerca.",
    color: 'accent',
    image: "/assets/speakers/italo_sannino.jpg",
    instagram: "https://www.instagram.com/italosan/",
    website: "https://www.italosan.com"
  },
  {
    id: 10,
    name: "Jekyll & Hyde",
    role: "Studio di graphic design e comunicazione visiva",
    description: "Jekyll & Hyde è uno studio di brand design fondato nel 1996 a Milano da Marco Molteni e Margherita Monguzzi. Definisce e sviluppa l’identità di brand italiani e internazionali in diversi settori, dal design alla moda, dalla finanza alla tecnologia, dall’arte contemporanea alla musica. Lo studio unisce strategia e cultura del progetto per creare soluzioni distintive in ogni ambito della comunicazione visiva.",
    color: 'primary',
    image: "/assets/speakers/Jekyll & Hyde.jpg",
    instagram: "https://www.instagram.com/jeh_it/",
    website: "https://www.jeh.it"
  },
  {
    id: 11,
    name: "Mauro Bubbico",
    role: "Progettista grafico e insegnante",
    description: "Mauro Bubbico vive e lavora a Montescaglioso come grafico professionista, privilegiando il design finalizzato all'educazione sociale e alla sostenibilità ambientale. Convinto che la cultura grafica sia capacità di costruire grandi narrazioni, ha definito un linguaggio contemporaneo per raccontare e valorizzare i luoghi e i loro abitanti. Membro AGI (Alliance Graphique Internationale), ha insegnato Progettazione Grafica in prestigiosi atenei come l’lsia di Urbino e l’Università di Bolzano. Attualmente insegna all'Abadir di Catania.",
    color: 'secondary',
    image: "/assets/speakers/Mauro Bubbico.jpg",
    instagram: "https://www.instagram.com/mauro_bubbico/",
    website: "https://www.maurobubbico.it"
  },
  {
    id: 12,
    name: "Mauro Mazzei",
    role: "Global Head of Creative Technology at LePub",
    description: "Mauro Mazzei è un creative technologist con oltre 15 anni di esperienza. Ha costruito la sua carriera lavorando a stretto contatto con team creativi e strategici, sperimentando tecnologie emergenti e coniugando innovazione e storytelling. Attualmente è Global Head of Creative Technology in LePub, dove guida l’integrazione tra creatività e tecnologia. Nel corso della sua carriera ha contribuito allo sviluppo di numerose iniziative internazionali, trasformando intuizioni concettuali in esperienze digitali memorabili.",
    color: 'accent',
    image: "/assets/speakers/Mauro-Mazzei.jpg",
    instagram: "https://www.instagram.com/mauromazzei/"
  },
  {
    id: 13,
    name: "Enrica D'Aguanno",
    role: "Art Director e docente",
    description: "Art Director e docente di Progettazione grafica, è coordinatrice della Scuola di Progettazione Artistica per l’Impresa presso l’Accademia di Belle Arti di Napoli. La sua attività professionale si concentra nell’ambito della comunicazione visiva e della grafica editoriale, con una particolare attenzione alla progettazione del libro d’arte e dei sistemi di identità visiva per il settore culturale. Ha collaborato come art director con importanti realtà editoriali e istituzionali, tra cui Electa Napoli, Prismi Editrice Politecnica Napoli, Mondadori, Artem, White Cloud University.",
    color: 'secondary',
    image: "/assets/speakers/enricadaguanno.jpg",
    instagram: "https://www.instagram.com/enricadaguanno/"
  },
  {
    id: 14,
    name: "PUG! Design Fest",
    role: "Festival di cultura visiva e design in Puglia",
    description: "PUG! Design Fest è il progetto curatoriale e la piattaforma di riferimento che connette la cultura del progetto al territorio pugliese. Attraverso una curatela attenta e una rete capillare di collaborazioni, il team ha costruito un ecosistema capace di far dialogare studi di fama globale, talenti emergenti e tessuto produttivo locale. Al LIFE Design Festival portano l'esperienza nella costruzione di community ad alto impatto e nella narrazione del design come strumento per generare valore sociale e identitario.",
    color: 'accent',
    image: "/assets/speakers/pug design fest.jpg",
    instagram: "https://www.instagram.com/pugdesignfest/",
    website: "https://www.pugdesignfest.com"
  },
  {
    id: 15,
    name: "Rocketpanda Studio",
    role: "Animation studio",
    description: "Fondatore e Direttore Creativo di Rocketpanda, nutre una profonda passione per il design, l’animazione e la motion graphics. È un orgoglioso padre di tre figli, possiede un paio di sintetizzatori e nel tempo libero ama suonare e comporre musica.",
    color: 'primary',
    image: "/assets/speakers/Riccardo Albertini (Rocketpanda).jpg",
    instagram: "https://www.instagram.com/rocketpanda/",
    website: "https://www.therocketpanda.com"
  },
  {
    id: 16,
    name: "Silvia Sguotti",
    role: "Freelance Art Director, Designer & Illustrator",
    description: "Silvia Sguotti è un’art director, designer e illustratrice italiana. Da più di dieci anni lavora con brand e agenzie per trasformare concept in brand identity, illustrazioni e storyboard. Nel tempo ha collaborato con clienti come Apple, Samsung, Collistar, Aputure e Lamborghini, adattandosi a brief, obiettivi e stili diversi per ogni progetto.",
    color: 'secondary',
    image: "/assets/speakers/silvia sguotti.jpg",
    instagram: "https://www.instagram.com/silviasguotti/",
    website: "https://www.behance.net/SilviaSguotti"
  },
  {
    id: 17,
    name: "Simone Checchia",
    role: "Creative Director",
    description: "Creative director in Blueorange®. Si occupa di branding e comunicazione, con focus sui progetti ad alto impatto sociale. Nel suo percorso ha sviluppato un’expertise specifica nella comunicazione della disabilità, curando progetti e collaborando a iniziative che hanno coinvolto Lega Serie A, FC Inter, AS Roma, Nazionale Italiana di Calcio e Università di Tor Vergata.",
    color: 'accent',
    image: "/assets/speakers/SimoneChecchia.jpg",
    instagram: "https://www.instagram.com/checchiadesign/",
    website: "https://www.checchiadesign.com"
  },
  {
    id: 18,
    name: "The Wave Studio",
    role: "Digital agency",
    description: "The Wave Studio nasce a Catania nel 2019 con un'idea semplice e ambiziosa: che il buon design e la tecnologia non siano un lusso, ma il modo più onesto di dare forma a un'idea. Lavorano su brand identity, UX/UI design, sviluppo web e mobile, strategia digitale, collaborando con brand come Lega Basket Serie A, Sky, Tot, Cosmico, Aeroporto di Catania.",
    color: 'primary',
    image: "/assets/speakers/The wave.jpg",
    instagram: "https://www.instagram.com/thewavestudio.it/",
    website: "https://www.thewavestudio.it"
  },
  {
    id: 19,
    name: "Zetafonts",
    role: "Independent type foundry",
    description: "Zetafonts è una fonderia di caratteri indipendenti con sede a Firenze, fondata nel 2001. Combinando lo studio della tradizione tipografica italiana con la ricerca sulle tendenze contemporanee del design e un approccio pop alla comunicazione, Zetafonts ha creato in poco più di vent’anni oltre duemila font. Zetafonts valorizza e promuove la cultura tipografica attraverso l'organizzazione di programmi educativi, conferenze e corsi.",
    color: 'secondary',
    image: "/assets/speakers/zeta fonts.jpg",
    instagram: "https://www.instagram.com/zetafonts/",
    website: "https://www.zetafonts.com"
  }
];
