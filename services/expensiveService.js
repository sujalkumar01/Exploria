exports.expensiveFunction = async (input) => {
    await new Promise((res) => setTimeout(res, 2000));
    const result = Math.abs(Math.sin(input) * 1000);
    return Math.floor(result) + 1;
  };
  