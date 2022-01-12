import {FilterType} from './const.js';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const sortByYear = (filmA, filmB) => filmB.year - filmA.year;
export const sortByRating = (filmA, filmB) => filmB.rating - filmA.rating;

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.inWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FilterType.FAVORITE]: (films) => films.filter((film) => film.isFavorite),
};
