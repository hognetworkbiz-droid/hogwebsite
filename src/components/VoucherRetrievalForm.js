import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';

function VoucherRetrievalForm({ plans }) {
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState('');
  const [result, setResult] = useState('');
  const { appState } = useAppState();

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult('');

    if (!phone || !plan) {
      setResult('Please enter phone and select plan.');
      return;
    }

    const entry = appState.issuedVouchers.find(v => v.phoneNumber === phone && v.plan === plan);
    if (entry) {
      setResult(`Your voucher code: ${entry.code}`);
    } else {
      setResult('No voucher found. Please contact admin.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 py-8 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Retrieve Your Voucher</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-300">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Data Plan</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
          >
            <option value="">Select a plan</option>
            {plans.map((p, i) => (
              <option key={i} value={p.data}>
                {p.data}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full px-5 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 shadow-md"
        >
          Get Voucher
        </button>
      </form>
      {result && (
        <p className="mt-4 text-center text-lg text-yellow-400">{result}</p>
      )}
    </div>
  );
}

export default VoucherRetrievalForm;
