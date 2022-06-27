export const arrayIncludesObject = (arr, obj) => {
  return arr.some((item) =>
    Object.keys(item).every((key) => item[key] === obj[key])
  );
};
