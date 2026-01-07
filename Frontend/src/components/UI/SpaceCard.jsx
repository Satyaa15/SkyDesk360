const SpaceCard = ({ image, title, desc, price }) => (
  <div className="group glass rounded-3xl overflow-hidden hover:border-[#00f2fe] transition-all duration-500">
    <div className="h-48 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    </div>
    <div className="p-8">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-6">{desc}</p>
      <div className="flex justify-between items-center">
        <span className="text-xl font-black">₹{price}<span className="text-xs text-gray-500 font-normal">/unit</span></span>
        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#00f2fe] group-hover:text-black transition-colors">
          →
        </div>
      </div>
    </div>
  </div>
);

export default SpaceCard;