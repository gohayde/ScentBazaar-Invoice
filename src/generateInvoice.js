/**
 * Generates an HTML invoice string based on the provided data.
 * 
 * @param {Object} businessDetails - { name, address, contact, logoSrc }
 * @param {Object} customerDetails - { name, address }
 * @param {Object} invoiceDetails - { invoiceNo, date, dueDate, vatRate, amountInWords }
 * @param {Array} items - Array of objects: { description, quantity, price }
 * @returns {string} The generated HTML content.
 */
export function generateInvoiceHtml(businessDetails, customerDetails, invoiceDetails, items) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const vatAmount = subtotal * (invoiceDetails.vatRate / 100);
  const grandTotal = subtotal + vatAmount;
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  const itemsHtml = items.map((item, index) => `
    <tr>
      <td class="td-no">${index + 1}</td>
      <td>${item.description}</td>
      <td class="td-qty">${item.quantity.toFixed(3)}</td>
      <td class="td-unit">${item.price.toFixed(2)}</td>
      <td class="td-total">${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${invoiceDetails.invoiceNo}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
        :root {
          --cream: #FFF7EA; --orange: #E84E0F; --black: #1A1A1A;
          --mid: #6B6460; --line: #E0D8D0; --row-alt: #F5F0EA;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; color: var(--black); padding: 40px; background: #EDEBE6; }
        .page { max-width: 820px; margin: 0 auto; background: var(--cream); padding: 48px 52px; border-radius: 4px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 2px solid var(--black); }
        .brand-logo { display: flex; align-items: center; gap: 18px; }
        .logo-icon { width: 64px; height: 64px; object-fit: contain; }
        .logo-divider { width: 1px; height: 48px; background: var(--line); }
        .brand-tagline { font-size: 11px; color: var(--mid); letter-spacing: 2px; text-transform: uppercase; margin-top: 6px; }
        .invoice-title-block { text-align: right; }
        .invoice-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--mid); margin-bottom: 6px; }
        .invoice-number { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 600; color: var(--orange); }
        .invoice-date { font-size: 13px; color: var(--mid); margin-top: 6px; }
        .meta-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; margin-bottom: 36px; padding: 22px 26px; background: white; border-radius: 8px; border: 1px solid var(--line); }
        .meta-block h4 { font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--orange); margin-bottom: 8px; }
        .meta-block p { font-size: 13px; line-height: 1.7; }
        .meta-block p strong { font-weight: 500; display: block; }
        .table-wrap { border-radius: 8px; overflow: hidden; border: 1px solid var(--line); margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        thead tr { background: var(--black); }
        thead th { color: var(--cream); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; padding: 13px 16px; text-align: left; }
        thead th.r { text-align: right; }
        tbody tr:nth-child(odd) { background: white; }
        tbody tr:nth-child(even) { background: var(--row-alt); }
        tbody td { padding: 10px 16px; border-bottom: 1px solid var(--line); }
        .td-qty, .td-unit, .td-total { text-align: right; font-variant-numeric: tabular-nums; }
        .td-unit { color: var(--mid); }
        .td-total { font-weight: 500; }
        .totals-area { display: flex; justify-content: flex-end; margin-bottom: 24px; }
        .totals-box { min-width: 300px; background: white; border: 1px solid var(--line); border-radius: 8px; }
        .totals-row { display: flex; justify-content: space-between; padding: 10px 20px; border-bottom: 1px solid var(--line); font-size: 13px; }
        .totals-row.grand { background: var(--black); color: var(--cream); padding: 14px 20px; }
        .totals-row.grand span:last-child { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--orange); }
        .amount-words { background: #F0EBE3; border: 1px solid var(--line); border-radius: 8px; padding: 13px 20px; margin-bottom: 36px; font-size: 12px; color: var(--mid); }
        .footer { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; padding-top: 28px; border-top: 1px solid var(--line); }
        .footer-block h5 { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--orange); margin-bottom: 8px; }
        .footer-block p { font-size: 12px; color: var(--mid); line-height: 1.8; }
        .footer-bottom { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--line); text-align: center; font-size: 11px; color: #B0A89E; }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          <div class="brand-logo">
            ${businessDetails.logoSrc ? `<img class="logo-icon" src="${businessDetails.logoSrc}" alt="Logo" />` : ''}
            <div class="logo-divider"></div>
            <div>
              <div style="font-size: 24px; font-weight: bold; font-family: 'Playfair Display', serif;">${businessDetails.name}</div>
              <div class="brand-tagline">Your Scent Supply HQ.</div>
            </div>
          </div>
          <div class="invoice-title-block">
            <div class="invoice-label">Invoice</div>
            <div class="invoice-number">${invoiceDetails.invoiceNo}</div>
            <div class="invoice-date">${invoiceDetails.date}</div>
          </div>
        </div>

        <div class="meta-row">
          <div class="meta-block">
            <h4>Billed To</h4>
            <p><strong>${customerDetails.name}</strong><br/>${customerDetails.address.replace(/\n/g, '<br/>')}</p>
          </div>
          <div class="meta-block">
            <h4>Invoice Details</h4>
            <p>Invoice No: <strong>${invoiceDetails.invoiceNo}</strong><br/>Date: ${invoiceDetails.date}<br/>Due: ${invoiceDetails.dueDate}</p>
          </div>
          <div class="meta-block">
            <h4>Total Qty</h4>
            <p><strong>${totalQty.toFixed(3)} kg</strong><br/>${items.length} line items<br/>VAT: ${invoiceDetails.vatRate}%</p>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Description</th>
                <th class="r">Qty (kg)</th>
                <th class="r">Unit Price</th>
                <th class="r">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>

        <div class="totals-area">
          <div class="totals-box">
            <div class="totals-row">
              <span class="totals-label">Total Quantity</span>
              <span>${totalQty.toFixed(3)} kg</span>
            </div>
            <div class="totals-row">
              <span class="totals-label">Subtotal</span>
              <span>AED ${subtotal.toFixed(2)}</span>
            </div>
            <div class="totals-row">
              <span class="totals-label">VAT (${invoiceDetails.vatRate}%)</span>
              <span>AED ${vatAmount.toFixed(2)}</span>
            </div>
            <div class="totals-row grand">
              <span class="totals-label">Grand Total</span>
              <span>AED ${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div class="amount-words">
          Amount in Words: <strong>${invoiceDetails.amountInWords}</strong>
        </div>

        <div class="footer">
          <div class="footer-block">
            <h5>${businessDetails.name}</h5>
            <p>${businessDetails.address.replace(/\n/g, '<br/>')}</p>
          </div>
          <div class="footer-block">
            <h5>Contact</h5>
            <p>${businessDetails.contact.replace(/\n/g, '<br/>')}</p>
          </div>
          <div class="footer-block">
            <h5>Thank You</h5>
            <p>Thank you for your business.<br>Payment is due on receipt.</p>
          </div>
        </div>

        <div class="footer-bottom">${businessDetails.name} · Your Scent Supply HQ.</div>
      </div>
    </body>
    </html>
  `;
}
