import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';

function AdminPaymentTab({ appState, showToast }) {
  const [whatsappNumber, setWhatsappNumber] = useState(appState.whatsAppNumber);
  const [bankName, setBankName] = useState(appState.manualPayment.bankName);
  const [accountNumber, setAccountNumber] = useState(appState.manualPayment.accountNumber);
  const [accountName, setAccountName] = useState(appState.manualPayment.accountName);
  const [paystackPublicKey, setPaystackPublicKey] = useState(appState.paystackPublicKey || '');
  const [paystackWebhookSecret, setPaystackWebhookSecret] = useState(appState.paystackWebhookSecret || '');
  const [paystackWebhookUrl, setPaystackWebhookUrl] = useState(appState.paystackWebhookUrl || '');
  const [paystackCallbackUrl, setPaystackCallbackUrl] = useState(appState.paystackCallbackUrl || '');
  const [transferApprovalUrl, setTransferApprovalUrl] = useState(appState.transferApprovalUrl || '');
  const { updateSettings } = useAppState();

  const handleContactSave = (e) => {
    e.preventDefault();
    updateSettings({ whatsAppNumber: whatsappNumber });
    showToast('Contact info saved!');
  };

  const handleStackSave = (e) => {
    e.preventDefault();
    updateSettings({
      paystackPublicKey,
      paystackWebhookSecret,
      paystackWebhookUrl,
      paystackCallbackUrl,
      transferApprovalUrl
    });
    showToast('Paystack configuration saved!');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('URL copied to clipboard');
    } catch (err) {
      console.error('Copy failed', err);
      showToast('Could not copy to clipboard');
    }
  };

  const handlePaymentSave = (e) => {
    e.preventDefault();
    updateSettings({
      manualPayment: { bankName, accountNumber, accountName }
    });
    showToast('Manual payment details saved!');
  };

  return (
    <div className="space-y-8">
      {/* Contact Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-white">Admin Contact</h2>
        <form onSubmit={handleContactSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">WhatsApp Number</label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full px-5 py-2 border border-transparent font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            Save Contact
          </button>
        </form>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-white">Paystack + Transfer Approval</h2>
        <form onSubmit={handleStackSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Live Public Key</label>
            <input
              type="text"
              value={paystackPublicKey}
              onChange={(e) => setPaystackPublicKey(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Live Secret Key</label>
            <input
              type="text"
              value={paystackWebhookSecret}
              onChange={(e) => setPaystackWebhookSecret(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Live Webhook URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={paystackWebhookUrl}
                onChange={(e) => setPaystackWebhookUrl(e.target.value)}
                className="mt-1 flex-grow px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(paystackWebhookUrl)}
                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Live Callback URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={paystackCallbackUrl}
                onChange={(e) => setPaystackCallbackUrl(e.target.value)}
                className="mt-1 flex-grow px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(paystackCallbackUrl)}
                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Transfer Approval URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={transferApprovalUrl}
                onChange={(e) => setTransferApprovalUrl(e.target.value)}
                className="mt-1 flex-grow px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(transferApprovalUrl)}
                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-500"
              >
                Copy
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-5 py-2 border border-transparent font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            Save Paystack/Transfer Config
          </button>
        </form>
      </div>

      {/* Manual Payment Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-white">Manual Payment Details</h2>
        <form onSubmit={handlePaymentSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Bank Name</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Account Name</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full px-5 py-2 border border-transparent font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            Save Payment Details
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPaymentTab;
