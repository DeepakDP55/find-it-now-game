import React from 'react';

interface GameData {
  itemPrice: number;
  gst: number;
  deliveryFee: number;
  membershipDiscount: number;
  displayedTotal: number;
  actualTotal: number;
  hasError: boolean;
  correctTotal: number;
}

interface BillSummaryProps {
  gameData: GameData;
}

const BillSummary: React.FC<BillSummaryProps> = ({gameData}) => {
  const {
    itemPrice,
    gst,
    deliveryFee,
    membershipDiscount,
    displayedTotal,
    correctTotal
  } = gameData;

  return (
    <div
      className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 shadow-2xl mb-6 animate-scale-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {/*<div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">*/}
        {/*  <Receipt size={16} className="text-black" />*/}
        {/*</div>*/}
        <div className="w-8 h-8 flex items-center justify-center">
          <img src="/favicon.ico" alt="Favicon" width={32} height={32}/>
        </div>
        <h2 className="text-xl font-bold text-white">Bill Summary</h2>
      </div>

      {/* Item total & GST */}
      <div className="flex justify-between items-center py-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-gray-300">Item Total & GST</span>
          <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-xs text-gray-400">i</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-gray-500 line-through mr-2">₹{Math.floor(itemPrice * 1.2)}</span>
          <span className="text-white font-semibold">₹{correctTotal}</span>
        </div>
      </div>

      {/* Delivery Fee */}
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center gap-2">
          {deliveryFee === 0 && (
            <span className="bg-green-500 text-black text-xs px-2 py-1 rounded-full font-semibold">
              daily
            </span>
          )}
          <span className="text-gray-300">
            Delivery Fee: {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
          </span>
        </div>
        <div className="text-right">
          {deliveryFee > 0 && <span className="text-gray-500 line-through mr-2">₹{deliveryFee + 10}</span>}
          <span className="text-white font-semibold">₹{deliveryFee}</span>
        </div>
      </div>

      {deliveryFee === 0 && (
        <div className="text-green-400 text-sm mb-4 animate-pulse">
          Free Delivery applied!
          <span className="text-red-400 ml-4 cursor-pointer hover:text-red-300">Remove</span>
        </div>
      )}

      {/* Membership - now as an added cost */}
      <div className="flex justify-between items-center py-3 border-b border-gray-700">
        <span className="text-gray-300">Zepto Membership</span>
        <div className="text-right">
          <span className="text-gray-500 line-through mr-2">₹{membershipDiscount + 30}</span>
          <span className="text-white font-semibold">₹{membershipDiscount}</span>
        </div>
      </div>

      {/* Total */}
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-lg font-bold text-white">To Pay</div>
            <div className="text-gray-400 text-sm">Incl. all taxes and charges</div>
          </div>
          <div className="text-right">
            <span className="text-gray-500 line-through mr-2">₹{correctTotal + 50}</span>
            <span className="text-2xl font-bold text-white">₹{displayedTotal}</span>
          </div>
        </div>
        <div className="text-right mt-2">
          <span className="bg-green-500/20 text-green-400 text-sm px-2 py-1 rounded">
            SAVING ₹{Math.floor(Math.random() * 200) + 100}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BillSummary;
