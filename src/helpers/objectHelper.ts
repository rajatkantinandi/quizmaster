export const isInt = (value: any) => {
  if (isNaN(value)) {
    return false;
  }
  var x = parseFloat(value);
  return (x | 0) === x;
};
