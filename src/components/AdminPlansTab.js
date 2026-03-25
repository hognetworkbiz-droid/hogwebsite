import React, { useState } from 'react';
import { useAppState } from '../hooks/useAppState';

function AdminPlansTab({ appState, showToast }) {
  const [plans, setPlans] = useState(appState.dataPlans);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    data: '',
    price: '',
    validity: '',
    devices: '',
    upload: '',
    download: '',
    paymentLink: ''
  });
  const { updateDataPlans } = useAppState();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPlan = {
      ...formData,
      price: parseFloat(formData.price),
      devices: parseInt(formData.devices),
      upload: parseFloat(formData.upload),
      download: parseFloat(formData.download)
    };

    let updatedPlans;
    if (editIndex !== null) {
      updatedPlans = [...plans];
      updatedPlans[editIndex] = newPlan;
      showToast('Plan updated!');
    } else {
      updatedPlans = [...plans, newPlan];
      showToast('Plan added!');
    }

    setPlans(updatedPlans);
    updateDataPlans(updatedPlans);
    clearForm();
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(plans[index]);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure?')) {
      const updatedPlans = plans.filter((_, i) => i !== index);
      setPlans(updatedPlans);
      updateDataPlans(updatedPlans);
      showToast('Plan deleted!');
    }
  };

  const clearForm = () => {
    setEditIndex(null);
    setFormData({
      data: '',
      price: '',
      validity: '',
      devices: '',
      upload: '',
      download: '',
      paymentLink: ''
    });
  };

  return (
    <div className="space-y-8">
      {/* Add/Edit Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {editIndex !== null ? 'Edit Data Plan' : 'Add New Data Plan'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="data"
            placeholder="Data (e.g., 1GB)"
            value={formData.data}
            onChange={handleInputChange}
            required
            className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleInputChange}
            required
            className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
          <input
            type="text"
            name="validity"
            placeholder="Validity (e.g., 24Hours)"
            value={formData.validity}
            onChange={handleInputChange}
            required
            className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
          <input
            type="number"
            name="devices"
            placeholder="Devices"
            value={formData.devices}
            onChange={handleInputChange}
            required
            className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
          <input
            type="number"
            name="upload"
            placeholder="Upload Speed"
            value={formData.upload}
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
          <input
            type="number"
            name="download"
            placeholder="Download Speed"
            value={formData.download}
            onChange={handleInputChange}
            className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
          <input
            type="url"
            name="paymentLink"
            placeholder="Payment Link"
            value={formData.paymentLink}
            onChange={handleInputChange}
            required
            className="col-span-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
          />
          <button
            type="submit"
            className="col-span-full px-5 py-2 border border-transparent font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            {editIndex !== null ? 'Update Plan' : 'Add Plan'}
          </button>
          {editIndex !== null && (
            <button
              type="button"
              onClick={clearForm}
              className="col-span-full px-5 py-2 border border-gray-600 font-medium rounded-lg text-gray-300 bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Plans List */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-white">Current Data Plans</h2>
        <div className="space-y-4">
          {plans.length === 0 ? (
            <p className="text-gray-400">No data plans added yet.</p>
          ) : (
            plans.map((plan, index) => (
              <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 flex justify-between items-start">
                <div>
                  <p className="text-lg font-semibold text-gray-200">{plan.data} - ₦{plan.price}</p>
                  <p className="text-sm text-gray-400">Validity: {plan.validity} | Devices: {plan.devices}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPlansTab;
