import React from 'react';
import { useAppState } from '../hooks/useAppState';

function AdminApprovalsTab({ appState, showToast }) {
  const { approvePendingPayment, rejectPendingPayment } = useAppState();

  const handleApprove = (index) => {
    const voucher = approvePendingPayment(index);
    if (voucher) {
      showToast(`Payment approved! Voucher: ${voucher.code}`);
    } else {
      showToast('Payment approved, but no voucher available');
    }
  };

  const handleReject = (index) => {
    rejectPendingPayment(index);
    showToast('Payment rejected');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-white">Manual Payment Approvals</h2>
      <p className="text-gray-300 mb-6">Review and approve manual bank transfer payments from users.</p>

      <div className="space-y-4">
        {appState.pendingPayments.length === 0 ? (
          <p className="text-gray-400">No pending payments at this time.</p>
        ) : (
          appState.pendingPayments.map((payment, index) => (
            <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-yellow-700 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-200">{payment.planName} - ₦{payment.amount}</p>
                  <p className="text-sm text-gray-400">Phone: {payment.phoneNumber}</p>
                  <p className="text-xs text-gray-500">Submitted: {new Date(payment.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(index)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(index)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminApprovalsTab;
