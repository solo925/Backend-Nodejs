const add = (a, b) => a + b;
const sub = (a, b) => a - b;

exports.addfunc.add = add(a, b);
exports.subfunc.sub = sub(a, b);

// exports.mathfunc = { add, sub }
module.exports = { add, sub }
