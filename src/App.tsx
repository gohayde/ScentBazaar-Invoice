import React, { useState, useEffect } from 'react';
import { InvoiceEditor } from './components/InvoiceEditor';
import { InvoicePreview } from './components/InvoicePreview';
import { InvoiceData } from './types';
import { Printer, Download, Edit3, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { aedToWords } from './utils/numberToWords';

export default function App() {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNo: 'B-1601-25',
    date: '25 Feb 2025',
    dueDate: '25 Feb 2025',
    billedToName: 'M/S. Cash Customer (BR)',
    billedToAddress: 'Dubai, UAE',
    vatRate: 0,
    amountInWords: '',
    items: [
      { id: '1', description: 'Cardamom', qty: 0.1, unitPrice: 450.00 },
      { id: '2', description: 'Passion Fruit – Fragrance', qty: 0.1, unitPrice: 200.00 },
      { id: '3', description: 'Musk Toot', qty: 0.5, unitPrice: 200.00 },
    ]
  });

  // Auto-calculate amount in words whenever items or VAT changes
  useEffect(() => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
    const vatAmount = subtotal * (invoiceData.vatRate / 100);
    const grandTotal = subtotal + vatAmount;
    
    setInvoiceData(prev => ({
      ...prev,
      amountInWords: aedToWords(grandTotal)
    }));
  }, [invoiceData.items, invoiceData.vatRate]);

  const handlePrint = () => {
    setActiveTab('preview');
    setTimeout(() => window.print(), 100);
  };

  const handleDownloadPdf = async () => {
    setActiveTab('preview');
    await new Promise(r => setTimeout(r, 300));

    const element = document.getElementById('invoice-preview');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({ unit: 'px', format: 'a4', orientation: 'portrait' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * pageW) / canvas.width;

    let y = 0;
    while (y < imgH) {
      if (y > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, -y, imgW, imgH);
      y += pageH;
    }

    pdf.save(`Invoice-${invoiceData.invoiceNo}.pdf`);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-gray-50">
      {/* Mobile Tabs */}
      <div className="lg:hidden flex bg-white border-b border-gray-200 no-print shadow-sm z-20">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-3 px-4 text-center font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'edit' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Edit3 className="w-4 h-4" /> Edit Details
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 px-4 text-center font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'preview' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Eye className="w-4 h-4" /> Preview & Print
        </button>
      </div>

      {/* Editor Sidebar */}
      <div className={`w-full lg:w-1/3 h-full overflow-y-auto bg-white border-r border-gray-200 no-print flex-col shadow-lg z-10 ${
        activeTab === 'edit' ? 'flex' : 'hidden lg:flex'
      }`}>
        <div className="p-4 border-b border-gray-100 bg-white/80 backdrop-blur-md flex flex-col gap-3 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Invoice Generator</h1>
            <div className="lg:hidden text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Edit Mode
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center bg-gray-800 text-white px-4 py-2.5 rounded-lg hover:bg-gray-900 shadow-sm transition-all active:scale-[0.98] text-sm font-medium"
            >
              <Printer className="w-4 h-4 mr-2" /> Print
            </button>
            <button
              onClick={handleDownloadPdf}
              className="flex-1 flex items-center justify-center bg-orange-600 text-white px-4 py-2.5 rounded-lg hover:bg-orange-700 shadow-sm transition-all active:scale-[0.98] text-sm font-medium"
            >
              <Download className="w-4 h-4 mr-2" /> Save PDF
            </button>
          </div>
        </div>
        <div className="flex-1">
          <InvoiceEditor data={invoiceData} onChange={setInvoiceData} />
        </div>
      </div>

      {/* Preview Area */}
      <div className={`w-full lg:w-2/3 h-full overflow-y-auto bg-gray-100/50 p-4 lg:p-8 print-area ${
        activeTab === 'preview' ? 'block' : 'hidden lg:block'
      }`}>
        {/* Mobile action buttons in preview tab */}
        <div className="lg:hidden flex gap-2 mb-4 no-print">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center bg-gray-800 text-white px-4 py-2.5 rounded-lg shadow-sm font-medium text-sm"
          >
            <Printer className="w-4 h-4 mr-2" /> Print
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex-1 flex items-center justify-center bg-orange-600 text-white px-4 py-2.5 rounded-lg shadow-sm font-medium text-sm"
          >
            <Download className="w-4 h-4 mr-2" /> Save PDF
          </button>
        </div>

        {/* Scale invoice to fit screen width on mobile */}
        <div className="w-full pb-8">
          <div className="invoice-scale-wrapper">
            <div className="min-w-[800px] max-w-4xl mx-auto shadow-2xl bg-white rounded-sm overflow-hidden">
              <InvoicePreview data={invoiceData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
