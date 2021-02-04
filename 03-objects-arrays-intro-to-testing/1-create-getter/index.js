/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return (obj) => getter(obj, path.split('.'));
}
function getter(obj, arr) {
  for (let str of arr) {
    obj = obj[str];
    if (obj === undefined) {
      break;
    }
  }
  return obj;
}
