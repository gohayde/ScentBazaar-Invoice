import React from 'react';
import { InvoiceData } from '../types';
import '../invoice.css';
import arpDisplayFont from '../assets/ARPDisplay-150.woff';

interface Props {
  data: InvoiceData;
}

export const InvoicePreview: React.FC<Props> = ({ data }) => {
  const subtotal = data.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const vatAmount = subtotal * (data.vatRate / 100);
  const grandTotal = subtotal + vatAmount;
  const totalQty = data.items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="invoice-template-container" id="invoice-preview">
      <style>{`@font-face { font-family: 'ARP Display'; src: url('${arpDisplayFont}') format('woff'); }`}</style>
      <div className="page">
        <div className="header">
          <div className="brand-logo">
            <div>
              <div className="logo-text">Scent Bazaar</div>
              <div className="brand-tagline">Your Scent Supply HQ.</div>
            </div>
          </div>
          <div className="invoice-title-block">
            <div className="invoice-label">Invoice</div>
            <div className="invoice-number">{data.invoiceNo}</div>
            <div className="invoice-date">{data.date}</div>
          </div>
        </div>

        <div className="meta-row">
          <div className="meta-block">
            <h4>Billed To</h4>
            <p>
              <strong>{data.billedToName}</strong>
              {data.billedToAddress.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}<br />
                </React.Fragment>
              ))}
            </p>
          </div>
          <div className="meta-block">
            <h4>Invoice Details</h4>
            <p>
              Invoice No: <strong>{data.invoiceNo}</strong><br />
              Date: {data.date}<br />
              Due: {data.dueDate}
            </p>
          </div>
          <div className="meta-block">
            <h4>Total Units</h4>
            <p>
              <strong>{totalQty.toFixed(3)}</strong><br />
              {data.items.length} line items<br />
              VAT: {data.vatRate}%
            </p>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Description</th>
                <th className="r">Units</th>
                <th className="r">Unit Price</th>
                <th className="r">Total (AED)</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="td-no">{index + 1}</td>
                  <td>{item.description}</td>
                  <td className="td-qty">{item.qty.toFixed(3)}</td>
                  <td className="td-unit">{item.unitPrice.toFixed(2)}</td>
                  <td className="td-total">{(item.qty * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="totals-area">
          <div className="totals-box">
            <div className="totals-row">
              <span className="totals-label">Total Units</span>
              <span>{totalQty.toFixed(3)}</span>
            </div>
            <div className="totals-row">
              <span className="totals-label">Subtotal</span>
              <span>AED {subtotal.toFixed(2)}</span>
            </div>
            <div className="totals-row">
              <span className="totals-label">VAT ({data.vatRate}%)</span>
              <span>AED {vatAmount.toFixed(2)}</span>
            </div>
            <div className="totals-row grand">
              <span className="totals-label">Grand Total</span>
              <span>AED {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="amount-words">
          Amount in Words: <strong>{data.amountInWords}</strong>
        </div>

        <div className="footer">
          <div className="footer-block">
            <h5>Scent Bazaar</h5>
            <p>Shop No. 47, Souq Naif<br />47 St, Naif, Deira<br />Dubai, UAE</p>
          </div>
          <div className="footer-block">
            <h5>Contact</h5>
            <p>+971 54 772 7106<br />info@scentbazaar.co<br />scentbazaar.co</p>
          </div>
          <div className="footer-block">
            <h5>Thank You</h5>
            <p>Thank you for your business.<br />Payment is due on receipt.</p>
          </div>
        </div>

        <div className="footer-bottom">Scent Bazaar · Your Scent Supply HQ. · Dubai</div>
      </div>
    </div>
  );
};
