import logo from '@/assets/logo.svg';

const FooterSection = () => {
  return (
    <footer className="relative py-20 md:py-32 border-t border-foreground/10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12">
          <div>
            <img src={logo} alt="Life Design Festival" className="h-12 md:h-16 w-auto" />
            <p className="font-body text-sm text-muted-foreground mt-4 max-w-sm">
              Life Design Festival — Seconda Edizione<br />
              5–6 Giugno 2026 • Potenza, Terminal Gallitello
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Social</p>
              <div className="flex flex-col gap-2">
                {['Instagram', 'Facebook', 'LinkedIn'].map((s) => (
                  <a key={s} href="#" className="font-body text-sm text-foreground hover:text-primary transition-colors duration-300">
                    {s}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Contatti</p>
              <div className="flex flex-col gap-2">
                <a href="mailto:info@lifedesignfestival.it" className="font-body text-sm text-foreground hover:text-primary transition-colors duration-300">
                  info@lifedesignfestival.it
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-muted-foreground">
            © 2026 Life Design Festival. Tutti i diritti riservati.
          </p>
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
