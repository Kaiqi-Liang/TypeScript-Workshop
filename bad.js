let num = 42;
// console.log(nun); // typo
// const num; // error
num = ''; // this is ok in JavaScript

const add = (a, b) => a + b;
console.log(add(1, 2)); // 3
console.log(add('1', 2)); // '12'
console.log(add(1)); // NaN

/**
 * @returns string | null
 */
localStorage.getItem('');