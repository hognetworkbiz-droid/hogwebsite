import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { checkVoucherBalance, retrieveVoucher } from '../services/api';

function VoucherRetrievalForm() {
  const { appState } = useAppState();
  const [voucherCode, setVoucherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [balanceData, setBalanceData] = useState(null);
  const [error, setError] = useState('');

  const handleCheckBalance = async (e) => {
    e.preventDefault();
    setBalanceData(null);
    setError('');
    const code = voucherCode.trim();
    if (!code) return setError('Please enter your voucher code.');

    setLoading(true);
    try {
      let response;
      try {
        response = await retrieveVoucher(code);
      } catch {
        response = await checkVoucherBalance(code);
      }
      setBalanceData(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        const local = appState.vouchers?.find((v) => v.code === code);
        if (local) {
          setBalanceData({
            status: local.used ? 'Used' : 'Active',
            totalGB: local.plan?.replace(/GB/i, '') || 'N/A',
            remainingGB: local.used ? 0 : local.plan?.replace(/GB/i, '') || 'N/A'
          });
          setError('OC300 endpoint not found. Showing local voucher data.');
        } else {
          setError('Voucher endpoint not found and local voucher not available.');
        }
      } else {
        setError(err.response?.data?.message || 'Could not verify voucher. Please check the code and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 px-4 py-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">Check Data Balance</h2>
      <p className="text-gray-400 text-center mb-6 text-sm">Enter your active voucher code to see your remaining data.</p>
      
      <form onSubmit={handleCheckBalance} className="space-y-4">
        <div>
          <input
            type="text"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="e.g., 12345-67890"
            required
            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-900 text-white text-center text-lg tracking-widest focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-5 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-md disabled:bg-gray-600"
        >
          {loading ? 'Checking OC300 Controller...' : 'Retrieve Voucher'}
        </button>
      </form>

      {/* Results Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-center">
          {error}
        </div>
      )}

      {balanceData && (
        <div className="mt-6 p-5 bg-gray-900 rounded-lg border border-blue-500/30">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Voucher Details</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-800 p-3 rounded">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Status</p>
              <p className={`font-bold ${balanceData.status === 'Active' ? 'text-green-400' : 'text-yellow-400'}`}>
                {balanceData.status}
              </p>
            </div>
            <div className="bg-gray-800 p-3 rounded">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Total Limit</p>
              <p className="font-bold text-white">{balanceData.totalGB} GB</p>
            </div>
          </div>
          <div className="mt-4 bg-gray-800 p-4 rounded text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Remaining Data</p>
            <p className="text-4xl font-extrabold text-blue-400">{balanceData.remainingGB} GB</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoucherRetrievalForm;