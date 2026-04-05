import React, { useState, useEffect, useCallback } from 'react';
import { getTransactionHistory, syncPaystackTransactions } from '../services/api';

function AdminTransactionsTab({ showToast }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTransactionHistory();
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      showToast('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const handleSyncPaystack = async () => {
    try {
      setSyncing(true);
      const response = await syncPaystackTransactions();
      showToast(response.data.message || 'Transactions synced successfully');
      fetchTransactions(); // Refresh the list
    } catch (error) {
      console.error('Failed to sync Paystack:', error);
      showToast('Failed to sync with Paystack');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); // fetchTransactions is stable due to useCallback

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount) => {
    return `₦${amount?.toLocaleString() || '0'}`;
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Transaction History</h2>
        <button
          onClick={handleSyncPaystack}
          disabled={syncing}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 flex items-center gap-2"
        >
          {syncing ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Syncing...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Sync Paystack
            </>
          )}
        </button>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-2">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No transactions found</p>
            <p className="text-sm text-gray-500 mt-2">Transactions will appear here after payments are processed</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                <tr>
                  <th className="px-6 py-3">Reference</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Plan</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-300">
                      {transaction.paymentReference || transaction.id}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {transaction.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {transaction.dataPlan || transaction.plan || 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-400">
                      {formatAmount(transaction.amount)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {transaction.source || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {formatDate(transaction.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-400">
          Total Transactions: {transactions.length}
        </div>
      </div>
    </div>
  );
}

export default AdminTransactionsTab;