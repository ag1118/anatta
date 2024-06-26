export const formatMoney = (amount, currencyCode) => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
  });

  return formatter.format(amount);
};
