import {FilterType} from './const.js';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const sortByDate = (filmA, filmB) => filmB.releaseDate - filmA.releaseDate;
export const sortByRating = (filmA, filmB) => filmB.rating - filmA.rating;
export const sortById = (filmA, filmB) => filmA.id - filmB.id;

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.inWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FilterType.FAVORITE]: (films) => films.filter((film) => film.isFavorite),
};

export const transformArrayToString = (array) => {
  const string = array.map((arrayItem) => arrayItem).join(', ');
  return string;
};

export const transformMinutesToHours = (time) => {
  const timeHours = Math.trunc(time / 60);
  const timeMinutes = time % 60;
  let fullTime = '';

  if (timeHours > 0) {
    fullTime = `${timeHours}h ${timeMinutes} m`;
  } else {
    fullTime = `${timeMinutes}m`;
  }

  return fullTime;
};
