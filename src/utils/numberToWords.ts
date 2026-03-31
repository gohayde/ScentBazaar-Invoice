const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertWholeNumber(num: number): string {
  if (num === 0) return 'Zero';
  if (num < 20) return ones[num];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + convertWholeNumber(num % 100) : '');
  if (num < 1000000) return convertWholeNumber(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + convertWholeNumber(num % 1000) : '');
  if (num < 1000000000) return convertWholeNumber(Math.floor(num / 1000000)) + ' Million' + (num % 1000000 !== 0 ? ' ' + convertWholeNumber(num % 1000000) : '');
  return num.toString();
}

export function aedToWords(amount: number): string {
  if (isNaN(amount) || amount < 0) return '';
  
  const fixedAmount = Number(amount).toFixed(2);
  const [dirhams, fils] = fixedAmount.split('.');
  const dirhamsNum = parseInt(dirhams, 10);
  const filsNum = parseInt(fils, 10);

  let words = 'UAE Dirhams ' + convertWholeNumber(dirhamsNum);
  
  if (filsNum > 0) {
    words += ' and ' + convertWholeNumber(filsNum) + ' Fils';
  } else {
    words += ' Only';
  }
  
  return words;
}
