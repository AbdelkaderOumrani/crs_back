// typescript function that generates a number between 20 and 40
export const generateNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const count_similarities = (arrayA: string[], arrayB: string[]) => {
  var matches = 0;
  for (let i = 0; i < arrayA.length; i++) {
    if (arrayB.indexOf(arrayA[i]) != -1) matches++;
  }
  return matches;
};

export const detectTerm = (length: number) => {
  // 6,12,18
  if (length >= 24) {
    return 5;
  }
  if (length >= 18) {
    return 4;
  }
  if (length >= 12) {
    return 3;
  }
  if (length >= 6) {
    return 2;
  }
  if (length < 6) {
    return 1;
  }
  return 1;
};

// a function that generates array of n items
export const generateArray = (n: number) => {
  let array = [];
  for (let i = 0; i < n; i++) {
    array.push(i);
  }
  return array;
};
