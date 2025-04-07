function binomialRand() {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const x = 5 * z + 50;
    return Math.min(Math.max(1, Math.round(x)), 100);
  }
  
  module.exports = { binomialRand };
  