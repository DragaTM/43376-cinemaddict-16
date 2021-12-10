export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const isEscKey = (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    return true;
  } else {
    return false;
  }
};
