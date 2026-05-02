import { useState, useEffect } from 'react';
import logo from '@/assets/logo.svg';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Speaker', id: 'speakers' },
    { label: 'Programma', id: 'program' },
    { label: 'LIFE 25', id: 'life25' },
    { label: 'Location', id: 'location' },
    { label: 'Partner', id: 'sponsors' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-background/90 backdrop-blur-md py-4' : 'py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <button onClick={() => scrollTo('hero')} className="z-50">
          <img src={logo} alt="Life Design Festival" className="h-8 w-auto" />
        </button>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                className="font-body text-[13px] uppercase tracking-widest text-foreground px-4 py-2 border border-transparent hover:border-foreground transition-all duration-300"
              >
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <a
              href="https://www.eventbrite.it/e/biglietti-life-design-festival-2026-1985936059213"
              target="_blank"
              rel="noopener noreferrer"
              className="group font-body text-[13px] uppercase tracking-widest bg-life-blue text-[#262626] px-5 py-2 hover:bg-life-pink hover:text-foreground transition-all duration-300 flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5">
                <path d="M7 7L17 17M17 17V7M17 17H7" stroke="#262626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Ticket</span>
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 z-[110] relative"
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-foreground transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden fixed inset-0 bg-background z-[100] flex flex-col items-center justify-center gap-8 transition-all duration-500 h-screen w-screen overflow-hidden ${menuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-10'}`}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="font-display text-4xl font-bold text-foreground"
          >
            {item.label}
          </button>
        ))}
        <a
          href="https://www.eventbrite.it/e/biglietti-life-design-festival-2026-1985936059213"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-lg uppercase tracking-widest bg-primary text-primary-foreground px-8 py-3 mt-4"
        >
          Tickets
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
