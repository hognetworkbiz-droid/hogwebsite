import React from 'react';

function DataPlansGrid({ plans, onBuyPlan }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {plans.map((plan, index) => (
        <div
          key={index}
          className="bg-gray-800/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 flex flex-col transform hover:scale-[1.02] transition-transform duration-300"
        >
          <div className="mb-4">
            <span className="inline-block bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
              {plan.validity}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2">{plan.data}</h2>
          <p className="text-4xl font-bold text-blue-400 mb-4">₦{plan.price}</p>
          <p className="text-gray-300 mb-6 flex-grow">Valid for {plan.devices} device(s).</p>
          <button
            onClick={() => onBuyPlan(plan)}
            className="w-full px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            Buy Now
          </button>
        </div>
      ))}
    </div>
  );
}

export default DataPlansGrid;
