const path = require('path');

console.log("Hello");
console.log(path.resolve('Botanica', 'Backend', 'index.js'));
console.log(path.resolve('/Botanica', 'Backend', 'index.js'));
console.log(path.resolve('Botanica', 'Backend', '/index.js'));