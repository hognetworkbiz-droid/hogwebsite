import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';
import { fetchOc300Vouchers } from '../services/api';

function AdminVouchersTab({ appState, showToast }) {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [codes, setCodes] = useState('');
  const { appState: state, updateSettings } = useAppState();

  const handleSync = async () => {
    try {
      const res = await fetchOc300Vouchers();
      const oc300Vouchers = res.data?.vouchers || [];
      if (oc300Vouchers.length === 0) {
        showToast('No vouchers returned from OC300.');
        return;
      }
      const formatted = oc300Vouchers.map((v) => ({
        code: v.code,
        plan: v.plan || selectedPlan || 'unknown',
        used: v.used || false,
        source: 'OC300'
      }));
      const merged = [...state.vouchers, ...formatted];
      updateSettings({ vouchers: merged });
      showToast(`Loaded ${formatted.length} vouchers from OC300.`);
    } catch (err) {
      console.error(err);
      showToast('Failed to sync from OC300.');
    }
  };

  const handleDeleteVoucher = (code) => {
    const keep = state.vouchers.filter((v) => v.code !== code);
    updateSettings({ vouchers: keep });
    showToast(`Voucher ${code} has been deleted.`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedPlan || !codes.trim()) {
      showToast('Please select plan and enter codes');
      return;
    }

    const voucherList = codes
      .split('\n')
      .map(c => c.trim())
      .filter(c => c)
      .map(code => ({
        code,
        plan: selectedPlan,
        used: false
      }));

    const updatedVouchers = [...state.vouchers, ...voucherList];
    updateSettings({ vouchers: updatedVouchers });
    
    showToast(`${voucherList.length} vouchers added for ${selectedPlan}`);
    setCodes('');
    setSelectedPlan('');
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-white">Manage Voucher Codes</h2>
        <p className="text-sm text-gray-400 mb-3">Enter one voucher code per line and select the associated data plan.</p>
        <button
          type="button"
          onClick={handleSync}
          className="mb-4 w-full px-4 py-2 border border-transparent font-medium rounded-lg text-white bg-green-600 hover:bg-green-700"
        >
          Sync vouchers from OC300 controller
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Select Plan</label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
            >
              <option value="">Choose a plan</option>
              {appState.dataPlans.map((plan, i) => (
                <option key={i} value={plan.data}>
                  {plan.data}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Voucher Codes</label>
            <textarea
              value={codes}
              onChange={(e) => setCodes(e.target.value)}
              placeholder="Enter codes (one per line)"
              rows="6"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full px-5 py-2 border border-transparent font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            Add Vouchers
          </button>
        </form>
      </div>

      {/* Vouchers List */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-white">Available Vouchers</h2>
        <div className="text-sm text-gray-400 mb-4">
          Total: {state.vouchers.length} | Used: {state.vouchers.filter(v => v.used).length} | Available: {state.vouchers.filter(v => !v.used).length}
        </div>

        {state.vouchers.length === 0 ? (
          <p className="text-gray-400">No vouchers stored yet.</p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {state.vouchers.map((v) => (
              <div key={v.code} className="p-3 bg-gray-900 rounded-lg border border-gray-700 flex justify-between items-center">
                <div>
                  <p className="text-gray-200 font-medium">{v.code}</p>
                  <p className="text-xs text-gray-400">Plan: {v.plan} | Status: {v.used ? 'Used' : 'Available'} | Source: {v.source || 'manual'}</p>
                </div>
                <button
                  onClick={() => handleDeleteVoucher(v.code)}
                  className="px-2 py-1 text-xs rounded bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminVouchersTab;
