/**
 * Dynamic price formatter that automatically abbreviates prices with many leading zeros
 * using superscript Unicode notation, e.g., 0.0⁸4512 instead of 0.000000004512.
 */

function toDecimalString(num: number): string {
  const str = num.toString();
  if (str.includes('e') || str.includes('E')) {
    const matches = str.match(/^([+-]?\d+)(?:\.(\d+))?[eE]([+-]?\d+)$/);
    if (matches) {
      const baseInt = matches[1];
      const baseFraction = matches[2] || "";
      const exponent = parseInt(matches[3], 10);
      
      if (exponent < 0) {
        const absExp = Math.abs(exponent);
        const leadingZeros = "0".repeat(absExp - 1);
        const digits = baseInt.replace(/[+-]/g, "") + baseFraction;
        return "0." + leadingZeros + digits;
      } else {
        return num.toFixed(20).replace(/\.?0+$/, "");
      }
    }
  }
  return str;
}

export function formatAbbreviatedPrice(price: number | string): string {
  if (price === undefined || price === null) return 'N/A';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return 'N/A';
  if (numPrice === 0) return '0.00';
  if (numPrice >= 0.01) {
    return numPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }

  // Convert to clean decimal string without scientific notation
  const decStr = toDecimalString(numPrice);
  const dotIdx = decStr.indexOf('.');
  if (dotIdx === -1) {
    return numPrice.toFixed(4);
  }

  const fractionPart = decStr.slice(dotIdx + 1);
  let zeroCount = 0;
  for (let i = 0; i < fractionPart.length; i++) {
    if (fractionPart[i] === '0') {
      zeroCount++;
    } else {
      break;
    }
  }

  // Only abbreviate if there are 4 or more zeros (e.g. 0.000045 -> 0.0⁴45)
  if (zeroCount < 4) {
    if (numPrice < 0.0001) return numPrice.toFixed(6);
    return numPrice.toFixed(5);
  }

  const remainingDigits = fractionPart.slice(zeroCount);
  const sigDigits = remainingDigits.slice(0, 4);

  const SUPERSCRIPTS: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };

  const exponentStr = String(zeroCount)
    .split('')
    .map(char => SUPERSCRIPTS[char] || char)
    .join('');

  return `0.0${exponentStr}${sigDigits}`;
}
