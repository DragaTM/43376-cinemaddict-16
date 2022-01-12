export const FILM_COUNT = 18;
export const FILM_COUNT_PER_STEP = 5;

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorite',
};

export const MenuItem = {
  FILMS: 'FILMS',
  STATS: 'STATS',
};

export const isEscKey = (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    return true;
  } else {
    return false;
  }
};

export const isSubmitKeys = (e) => e.keyCode === 13 && e.ctrlKey;

export const isClickOnLink = (e) => {
  if (e.target.tagName !== 'A') {
    return true;
  } else {
    return false;
  }
};

export const isClickOnInput = (e) => {
  if (e.target.tagName !== 'INPUT') {
    return true;
  } else {
    return false;
  }
};
