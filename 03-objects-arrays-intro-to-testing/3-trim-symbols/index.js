/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }
  let num = 0;
  let currentSymbol = string.slice(0, 1);
  const arr = [];
  if (size > 0) {
    for (let symbol of Array.from(string)) {
      if (currentSymbol !== symbol) {
        currentSymbol = symbol;
        num = 1;
        arr.push(symbol);
      } else {
        if (num < size) {
          num++;
          arr.push(symbol);
        }
      }
    }
  }
  return arr.join('');
}
