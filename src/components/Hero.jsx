export const Hero = () => (
  <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
    <div className="absolute inset-0 z-0 bg-primary">
      <img className="w-full h-full object-cover mix-blend-overlay" src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=2070" alt="Parking" />
      <div className="absolute inset-0 hero-gradient"></div>
    </div>
    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-3xl">
        <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-accent text-sm font-bold mb-6 animate-fade-in-up">
          INNOVACIÓN URBANA
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up [animation-delay:100ms]">
          Gestión Inteligente de Parkings
        </h1>
        <p className="text-lg text-white/90 mb-10 max-w-xl animate-fade-in-up [animation-delay:200ms]">
          Optimice el flujo de vehículos y tome el control total de sus espacios.
        </p>
        <div className="flex flex-wrap gap-4 animate-fade-in-up [animation-delay:300ms]">
          <button className="bg-secondary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:-translate-y-1 transition-all">
            Conocer más <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  </section>
);