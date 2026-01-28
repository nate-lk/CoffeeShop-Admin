const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
    
    {/* 1. 'hidden': Hides the icon container on all screen sizes by default.
      2. 'lg:block': Overrides 'hidden' only on large screens (1024px and up).
    */}
    {/* <div className={`hidden lg:block p-3 rounded-full ${colorClass}`}>
      <Icon className="w-6 h-6 text-white" />
    </div> */}
  </div>
);

export default StatCard;