import logo from '@/assets/logo.svg';

const FooterSection = () => {
  return (
    <footer className="relative pt-0 pb-20 md:pb-32 border-t border-foreground/10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12 pt-8">
          <div>
            <img src={logo} alt="Life Design Festival" className="h-12 md:h-16 w-auto" />
            <div className="font-body text-sm text-foreground/70 mt-4 max-w-sm space-y-1">
              <p>Life Design Festival — Seconda Edizione</p>
              <p>5–6 Giugno 2026 • Potenza, Terminal Gallitello</p>
              <div className="pt-4">
                <p>Fiiico Creative SRLs</p>
                <p>Potenza, PZ - (IT) - Via Mantova 32/B</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-foreground/50 mb-3">Social</p>
              <div className="flex flex-col gap-2">
                {[
                  { name: 'Instagram', url: 'https://www.instagram.com/life.designfestival/' },
                  { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61574592376779' },
                  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/life-design-festival/' }
                ].map((s) => (
                  <a 
                    key={s.name} 
                    href={s.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-body text-sm text-foreground/80 hover:text-primary transition-colors duration-300"
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-foreground/50 mb-3">Contatti</p>
              <div className="flex flex-col gap-2">
                <a href="mailto:info@lifedesignfestival.it" className="font-body text-sm text-foreground/80 hover:text-primary transition-colors duration-300">
                  info@lifedesignfestival.it
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="font-body text-sm text-foreground/70">
              © 2026 Life Design Festival. Tutti i diritti riservati.
            </p>
            <a 
              href="https://github.com/alessandrodelmoro9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group font-body text-sm text-foreground/70 flex items-center gap-2"
            >
              <span>made with love & an ai agent swarm by</span>
              <span className="font-bold border-b border-current transition-colors duration-300 group-hover:text-primary">alessandro del moro</span>
            </a>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary" />
            <div className="w-3 h-3 bg-secondary" />
            <div className="w-3 h-3 bg-accent" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
