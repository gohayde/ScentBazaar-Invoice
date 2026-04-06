import React from 'react';
import { InvoiceData, InvoiceItem } from '../types';
import { Plus, Trash2, FileText, User, List, Calculator } from 'lucide-react';

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export const InvoiceEditor: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (field: keyof InvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    const newItems = data.items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      qty: 0,
      unitPrice: 0
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (id: string) => {
    onChange({ ...data, items: data.items.filter(item => item.id !== id) });
  };

  return (
    <div className="p-4 lg:p-6 space-y-8 bg-white">
      {/* Invoice Details Section */}
      <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
          <FileText className="w-5 h-5 mr-2 text-blue-500" /> Invoice Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No</label>
            <input 
              type="text" 
              value={data.invoiceNo} 
              onChange={e => handleChange('invoiceNo', e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">VAT Rate (%)</label>
            <input 
              type="number" 
              value={data.vatRate} 
              onChange={e => handleChange('vatRate', parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="text" 
              value={data.date} 
              onChange={e => handleChange('date', e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              placeholder="e.g. 25 Feb 2025"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input 
              type="text" 
              value={data.dueDate} 
              onChange={e => handleChange('dueDate', e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              placeholder="e.g. 25 Feb 2025"
            />
          </div>
        </div>
      </div>

      {/* Billed To Section */}
      <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
          <User className="w-5 h-5 mr-2 text-blue-500" /> Billed To
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input 
              type="text" 
              value={data.billedToName} 
              onChange={e => handleChange('billedToName', e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea 
              value={data.billedToAddress} 
              onChange={e => handleChange('billedToAddress', e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white resize-none"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center text-gray-800">
            <List className="w-5 h-5 mr-2 text-blue-500" /> Items
          </h2>
          <button
            onClick={addItem}
            className="flex items-center text-sm bg-blue-50 text-blue-600 font-medium px-4 py-2.5 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 min-h-[44px]"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Item
          </button>
        </div>
        
        <div className="space-y-3">
          {data.items.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm transition-all hover:border-blue-300">
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Item description"
                  />
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="mt-5 text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Units</label>
                  <input
                    type="number"
                    step="0.001"
                    value={item.qty}
                    onChange={e => handleItemChange(item.id, 'qty', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Price (AED)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={e => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
          {data.items.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
              No items added. Click "Add Item" to start.
            </div>
          )}
        </div>
      </div>

      {/* Amount in Words Section */}
      <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
          <Calculator className="w-5 h-5 mr-2 text-blue-500" /> Amount in Words
        </h2>
        <div>
          <input 
            type="text" 
            value={data.amountInWords} 
            readOnly
            className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 font-medium cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-2 flex items-center">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
            Automatically calculated based on total amount.
          </p>
        </div>
      </div>
    </div>
  );
};
