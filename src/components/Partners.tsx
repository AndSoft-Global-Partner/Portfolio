export default function Partners() {
  const partners = [
    'IBM', 'Microsoft', 'Oracle', 'SAP', 'SanDisk',
    'Google', 'Amazon', 'HubSpot', 'Uber', 'Slack'
  ];

  return (
    <section id="partners" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          <span className="text-cyan-400">Partners</span>
        </h2>
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
          <h3 className="text-2xl font-bold text-center text-white mb-8">
            Collaborating For <span className="text-cyan-400">Success</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-cyan-500/10 hover:border-cyan-500/30"
              >
                <span className="text-gray-400 font-semibold hover:text-cyan-400 transition-colors">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
