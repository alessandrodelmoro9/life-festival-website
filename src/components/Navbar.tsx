import { useState, useEffect } from 'react';

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
    { label: 'Location', id: 'location' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-background/90 backdrop-blur-md py-4' : 'py-6'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <button onClick={() => scrollTo('hero')} className="font-display text-xl font-bold tracking-tight text-foreground">
          life
        </button>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                className="font-body text-sm uppercase tracking-widest text-foreground hover:text-primary transition-colors duration-300"
              >
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => scrollTo('location')}
              className="font-body text-sm uppercase tracking-widest bg-primary text-primary-foreground px-5 py-2 hover:opacity-90 transition-opacity duration-300"
            >
              Tickets
            </button>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 z-50"
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-foreground transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden fixed inset-0 bg-background z-40 flex flex-col items-center justify-center gap-8 transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="font-display text-4xl font-bold text-foreground"
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={() => scrollTo('location')}
          className="font-body text-lg uppercase tracking-widest bg-primary text-primary-foreground px-8 py-3 mt-4"
        >
          Tickets
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
