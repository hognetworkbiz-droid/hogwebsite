import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';

function AdminSettingsTab({ appState, showToast }) {
  const [siteName, setSiteName] = useState(appState.siteName);
  const [logoPreview, setLogoPreview] = useState(appState.logoDataUrl);
  const [bgPreview, setBgPreview] = useState(appState.bgDataUrl);
  const { updateSettings } = useAppState();

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      if (type === 'logo') {
        setLogoPreview(dataUrl);
      } else if (type === 'bg') {
        setBgPreview(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      siteName,
      logoDataUrl: logoPreview,
      bgDataUrl: bgPreview
    });
    showToast('Site settings saved!');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Site Identity</h2>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Site Name</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'logo')}
            className="mt-1 block w-full"
          />
          {logoPreview && (
            <img src={logoPreview} alt="Logo Preview" className="mt-3 h-12 w-auto bg-gray-700 p-1 rounded" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Background Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'bg')}
            className="mt-1 block w-full"
          />
          {bgPreview && (
            <img src={bgPreview} alt="Background Preview" className="mt-3 h-24 w-auto bg-gray-700 p-1 rounded" />
          )}
        </div>

        <button
          type="submit"
          className="w-full px-5 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}

export default AdminSettingsTab;
