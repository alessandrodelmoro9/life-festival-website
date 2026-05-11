import React from 'react';
import group61 from '@/assets/Group 61.svg';
import group58 from '@/assets/Group 58.svg';
import group59 from '@/assets/Group 59.svg';

const AccommodationSection = () => {
  const accommodations = [
    {
      name: "Il Salone di Gino",
      logo: group61,
      link: "https://minicasailsalonedigino.it",
      className: "h-20 md:h-28"
    },
    {
      name: "Leucos",
      logo: group58,
      link: "https://www.myleucos.com",
      className: "h-16 md:h-24"
    },
    {
      name: "Blunotte",
      logo: group59,
      link: "https://www.blunottehouse.com/it/potenza",
      className: "h-8 md:h-12"
    }
  ];

  return (
    <section id="accommodation" className="bg-life-cream py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 text-center">
        {/* H1 Title */}
        <h2 className="text-h1 text-life-black mb-10 md:mb-14 tracking-tighter">
          Alloggia a Potenza
        </h2>

        {/* Content Box (H2, H5, H6) - 592px width, 34px gap */}
        <div className="flex flex-col gap-[34px] max-w-[592px] mx-auto mb-16 md:mb-20">
          <h2 className="text-life-black tracking-tighter">
            Good to know!
          </h2>
          <h5 className="font-body text-life-black/80 normal-case leading-tight">
            Vuoi venire al festival ma non sai dove alloggiare? Contatta telefonicamente le strutture convenzionate con noi per accedere ad una scontistica speciale dedicata ai partecipanti del festival
          </h5>
          <h6 className="font-body font-medium text-life-black normal-case italic">
            Nota bene: in fase di contatto specifica la tua partecipazione al festival per accedere allo sconto!
          </h6>
        </div>
        
        {/* Logos Grid - 799x128 with auto spacing */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-[799px] mx-auto md:h-[128px] gap-12 md:gap-0">
          {accommodations.map((item, idx) => (
            <a 
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform duration-300 hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center"
            >
              <img 
                src={item.logo} 
                alt={item.name} 
                className={`${item.className} w-auto object-contain`}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccommodationSection;
