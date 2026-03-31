export type InvoiceItem = {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
};

export type InvoiceData = {
  invoiceNo: string;
  date: string;
  dueDate: string;
  billedToName: string;
  billedToAddress: string;
  vatRate: number;
  amountInWords: string;
  items: InvoiceItem[];
};
