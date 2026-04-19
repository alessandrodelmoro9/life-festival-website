export interface ProgramItem {
  id: number;
  time: string;
  title: string;
  day: string;
  type: 'Talk' | 'Workshop' | 'Exposition' | 'Party' | 'Network' | 'Event' | 'Break';
}

export const programData: ProgramItem[] = [
  // --- GIORNO 1 - 5 GIUGNO ---
  { id: 1, time: '09:00 - 10:00', title: 'Registrazione', day: '5 GIU', type: 'Event' },
  { id: 2, time: '10:05 - 10:30', title: 'Introduzione al Festival e Saluti', day: '5 GIU', type: 'Event' },
  { id: 3, time: '10:35 - 11:00', title: 'Ego55', day: '5 GIU', type: 'Talk' },
  { id: 4, time: '11:05 - 11:30', title: 'PUG! Design Fest', day: '5 GIU', type: 'Talk' },
  { id: 5, time: '11:30 - 12:00', title: 'Pausetta', day: '5 GIU', type: 'Break' },
  { id: 6, time: '12:05 - 12:30', title: 'Italo Sannino', day: '5 GIU', type: 'Talk' },
  { id: 7, time: '12:35 - 13:00', title: 'Silvia Sguotti', day: '5 GIU', type: 'Talk' },
  { id: 8, time: '13:05 - 13:30', title: 'BeFamily', day: '5 GIU', type: 'Talk' },
  { id: 9, time: '13:30 - 16:00', title: 'Pausona', day: '5 GIU', type: 'Break' },
  { id: 10, time: '13:50 - 15:50', title: 'Enrica D’Aguanno', day: '5 GIU', type: 'Workshop' },
  { id: 11, time: '14:50 - 15:30', title: 'Grande Venerdì di Enzo (ADCI)', day: '5 GIU', type: 'Network' },
  { id: 12, time: '16:05 - 16:30', title: 'Brutto Studio', day: '5 GIU', type: 'Talk' },
  { id: 13, time: '16:35 - 17:00', title: 'Jekyll & Hyde', day: '5 GIU', type: 'Talk' },
  { id: 14, time: '17:30 - 18:00', title: 'Pausetta', day: '5 GIU', type: 'Break' },
  { id: 15, time: '18:05 - 18:30', title: 'DVERSO STUDIO', day: '5 GIU', type: 'Talk' },
  { id: 16, time: '18:35 - 19:00', title: 'Adoratorio', day: '5 GIU', type: 'Talk' },
  { id: 17, time: '19:05 - 19:35', title: 'Grande Venerdì di Enzo (ADCI)', day: '5 GIU', type: 'Network' },
  { id: 18, time: '19:05 - 19:35', title: 'Zetafonts - Attività', day: '5 GIU', type: 'Event' },

  // --- GIORNO 2 - 6 GIUGNO ---
  { id: 19, time: '09:00 - 09:30', title: 'Registrazione / Check-in', day: '6 GIU', type: 'Event' },
  { id: 20, time: '09:30 - 10:20', title: 'P131 - Textures', day: '6 GIU', type: 'Workshop' },
  { id: 21, time: '09:30 - 11:30', title: 'Italo Sannino - Figma Community', day: '6 GIU', type: 'Workshop' },
  { id: 22, time: '10:35 - 11:00', title: 'Simone Checchia', day: '6 GIU', type: 'Talk' },
  { id: 23, time: '11:05 - 11:45', title: 'Zetafonts - Attività', day: '6 GIU', type: 'Event' },
  { id: 24, time: '11:50 - 12:15', title: 'Auge', day: '6 GIU', type: 'Talk' },
  { id: 25, time: '12:20 - 12:45', title: 'The Wave', day: '6 GIU', type: 'Talk' },
  { id: 26, time: '12:50 - 15:30', title: 'Pausona', day: '6 GIU', type: 'Break' },
  { id: 27, time: '13:30 - 15:30', title: 'Zetafonts', day: '6 GIU', type: 'Workshop' },
  { id: 28, time: '15:35 - 16:00', title: 'Mauro Mazzei', day: '6 GIU', type: 'Talk' },
  { id: 29, time: '16:05 - 16:30', title: 'Rocket Panda', day: '6 GIU', type: 'Talk' },
  { id: 30, time: '16:35 - 17:00', title: 'Zetafonts', day: '6 GIU', type: 'Talk' },
  { id: 31, time: '17:00 - 17:30', title: 'Pausetta', day: '6 GIU', type: 'Break' },
  { id: 32, time: '17:35 - 18:00', title: 'Dude Agency', day: '6 GIU', type: 'Talk' },
  { id: 33, time: '18:05 - 18:30', title: 'ET STUDIO', day: '6 GIU', type: 'Talk' },
  { id: 34, time: '18:35 - 19:00', title: 'Mauro Bubbico', day: '6 GIU', type: 'Talk' },
  { id: 35, time: '19:05 - 19:25', title: 'Zetafonts - IN STANDBY', day: '6 GIU', type: 'Event' },
];