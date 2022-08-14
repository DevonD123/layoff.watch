/**
 * Use this to remove commas from a string that should be a number
 */
export const getValueForWholeNumber = (value?: string | number) => {
  if (typeof value === "undefined") {
    return undefined;
  }
  if (typeof value === "number") {
    return value;
  }
  const intVal = parseInt(value.split(",").join(""));
  if (isNaN(intVal)) {
    return undefined;
  }
  return intVal;
};

export const getCommaSeperatedText = (value: string) => {
  const emp = value.split(",").join("");
  if (value === "" || emp === "" || /^[0-9]*$/.test(emp)) {
    let resWithCommas = emp;
    const charsLength = emp.length;
    if (charsLength >= 4) {
      let chunks = [];

      for (let i = charsLength - 3; i >= -2; i -= 3) {
        chunks.unshift(emp.substring(i, i + 3));
      }
      resWithCommas = chunks.join(",");
    }
    return resWithCommas;
  } else {
    return null;
  }
};
