import { Phone, Mail, MapPin } from 'lucide-react';

export default function TrustedBy() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {/* Partner Card */}
          <div 
            className="backdrop-blur-[1.5px] rounded-[2.5rem] p-10 border border-white/20 shadow-2xl flex flex-col justify-center items-center text-center transition-all duration-300 hover:bg-white/5" 
            style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}
          >
            <h2 className="text-xl font-medium text-white/50 mb-8 tracking-widest uppercase">
              Partnered <span className="text-cyan-400/80">with</span>
            </h2>
            <div className="relative group">
              <div className="absolute -inset-4 bg-cyan-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <img 
                src="/bichil.png" 
                alt="Bichil" 
                className="h-24 md:h-28 object-contain relative transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

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
            className="backdrop-blur-[1.5px] rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl transition-all duration-300 hover:bg-white/5 min-h-[300px]" 
            style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2673.743111425023!2d106.917411!3d47.9254331!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d9692440337f711%3A0x679093bf6dfd0999!2sEmbassy%20One!5e0!3m2!1sen!2smn!4v1710000000000!5m2!1sen!2smn"
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(90%)' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="opacity-70 hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}


