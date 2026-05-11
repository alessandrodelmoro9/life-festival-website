export interface ProgramItem {
  id: number;
  time: string;
  title: string;
  day: string;
  type: 'Talk' | 'Workshop' | 'Exposition' | 'Party' | 'Portfolio Review' | 'Intro' | 'Break' | 'Activity';
}

export const programData: ProgramItem[] = [
  // --- GIORNO 1 - 5 GIUGNO ---
  { id: 1, time: '09:00', title: 'Apertura porte', day: '5 GIU', type: 'Intro' },
  { id: 2, time: '10:05 - 10:30', title: 'Introduzione al Festival', day: '5 GIU', type: 'Intro' },
  { id: 3, time: '10:35 - 11:00', title: 'Ego55', day: '5 GIU', type: 'Talk' },
  { id: 4, time: '11:05 - 11:30', title: 'PUG!', day: '5 GIU', type: 'Talk' },
  { id: 5, time: '11:30 - 12:00', title: 'Pausetta', day: '5 GIU', type: 'Break' },
  { id: 6, time: '12:05 - 12:30', title: 'Italo Sannino', day: '5 GIU', type: 'Talk' },
  { id: 7, time: '12:35 - 13:00', title: 'Silvia Sguotti', day: '5 GIU', type: 'Talk' },
  { id: 8, time: '13:05 - 13:30', title: 'BeFamily', day: '5 GIU', type: 'Talk' },
  { id: 9, time: '13:30 - 16:00', title: 'Pausona', day: '5 GIU', type: 'Break' },
  { id: 10, time: '13:50 - 15:50', title: 'Enrica D’Aguanno', day: '5 GIU', type: 'Workshop' },
  { id: 12, time: '16:05 - 16:30', title: 'Brutto Studio', day: '5 GIU', type: 'Talk' },
  { id: 13, time: '16:35 - 17:00', title: 'Jekyll & Hyde', day: '5 GIU', type: 'Talk' },
  { id: 14, time: '17:05 - 17:35', title: 'Pausetta', day: '5 GIU', type: 'Break' },
  { id: 15, time: '17:40 - 18:05', title: 'Dverso Studio', day: '5 GIU', type: 'Talk' },
  { id: 16, time: '18:10 - 18:35', title: 'Adoratorio', day: '5 GIU', type: 'Talk' },
  { id: 18, time: '18:40 - 19:20', title: 'Zetafonts - Attività', day: '5 GIU', type: 'Activity' },

  // --- GIORNO 2 - 6 GIUGNO ---
  { id: 19, time: '09:00', title: 'Apertura porte', day: '6 GIU', type: 'Intro' },
  { id: 21, time: '09:15 - 11:00', title: 'Italo Sannino (Figma Community)', day: '6 GIU', type: 'Workshop' },
  { id: 22, time: '10:30 - 10:55', title: 'Simone Checchia', day: '6 GIU', type: 'Talk' },
  { id: 23, time: '11:00 - 11:30', title: 'Zetafonts - Attività', day: '6 GIU', type: 'Activity' },
  { id: 24, time: '11:35 - 12:00', title: 'Auge', day: '6 GIU', type: 'Talk' },
  { id: 25, time: '12:05 - 12:30', title: 'The Wave studio', day: '6 GIU', type: 'Talk' },
  { id: 36, time: '12:35 - 13:00', title: 'Cosmico online', day: '6 GIU', type: 'Talk' },
  { id: 26, time: '13:00 - 15:30', title: 'Pausona', day: '6 GIU', type: 'Break' },
  { id: 27, time: '13:30 - 15:30', title: 'Zetafonts', day: '6 GIU', type: 'Workshop' },
  { id: 28, time: '15:35 - 16:00', title: 'Mauro Mazzei', day: '6 GIU', type: 'Talk' },
  { id: 29, time: '16:05 - 16:25', title: 'Rocket Panda', day: '6 GIU', type: 'Talk' },
  { id: 30, time: '16:30 - 16:55', title: 'Zetafonts', day: '6 GIU', type: 'Talk' },
  { id: 31, time: '17:00 - 17:30', title: 'Pausetta', day: '6 GIU', type: 'Break' },
  { id: 32, time: '17:35 - 18:00', title: 'Dude Agency', day: '6 GIU', type: 'Talk' },
  { id: 33, time: '18:05 - 18:30', title: 'ET studio', day: '6 GIU', type: 'Talk' },
  { id: 37, time: '18:35 - 19:00', title: 'Cromia Design (Samuela Vaccari)', day: '6 GIU', type: 'Talk' },
  { id: 34, time: '19:05 - 19:25', title: 'Mauro Bubbico', day: '6 GIU', type: 'Talk' },
  { id: 35, time: '19:30 - 19:50', title: 'Zetafonts - Attività', day: '6 GIU', type: 'Activity' },
];
