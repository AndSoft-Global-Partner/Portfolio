import { Phone, Mail, MapPin } from 'lucide-react';

export default function AboutContact() {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Contact Info Card */}
          <div 
            className="backdrop-blur-[1.5px] rounded-[2.5rem] p-10 border border-white/20 shadow-2xl transition-all duration-300 hover:bg-white/5" 
            style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}
          >
            <div className="mb-8">
              <div className="text-3xl font-semibold text-white tracking-tight mb-4">
                <span className="text-cyan-400">And</span>Soft
              </div>
              <p className="text-white/70 leading-relaxed text-base font-light">
                Leading provider of modern web and mobile solutions.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 group cursor-default">
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                  <Phone size={18} className="text-cyan-400/80" />
                </div>
                <span className="text-base text-white/80 font-light group-hover:text-white transition-colors">+976 99119000</span>
              </div>
              
              <div className="flex items-center space-x-4 group cursor-default">
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                  <Mail size={18} className="text-cyan-400/80" />
                </div>
                <span className="text-base text-white/80 font-light group-hover:text-white transition-colors">contact@andsoft.com</span>
              </div>
              
              <div className="flex items-center space-x-4 group cursor-default">
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                  <MapPin size={18} className="text-cyan-400/80" />
                </div>
                <span className="text-base text-white/80 font-light group-hover:text-white transition-colors">Embassy One, 10th Floor</span>
              </div>
            </div>
          </div>

          {/* Map Card */}
          <div 
            className="backdrop-blur-[1.5px] rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl transition-all duration-300 hover:bg-white/5 min-h-[300px] relative group" 
            style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}
          >
            <a
              href="https://maps.app.goo.gl/AnQqmdH7yEd2PeqDA"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10 block w-full h-full"
            >
              <span className="sr-only">Open in Google Maps</span>
            </a>
            <iframe
              src="https://www.google.com/maps?q=Embassy+One+бизнес+оффис+Job+Job,+Ulaanbaatar&z=17&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(100%) invert(90%) co.ntrast(90%)' }}
              allowFullScreen
              loading="lazy"
              className="opacity-70 group-hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

