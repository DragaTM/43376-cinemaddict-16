import AbstractView from './abstract-view.js';
import {FilterType} from '../const.js';

const createMenuTemplate = (filters, currentFilterType) => {
  const all = filters[0];
  const watchlist = filters[1];
  const history = filters[2];
  const favorite = filters[3];

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item ${currentFilterType === FilterType.ALL ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.ALL}">${all.name}</a>
      <a href="#watchlist" class="main-navigation__item ${currentFilterType === FilterType.WATCHLIST ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.WATCHLIST}">${watchlist.name} <span class="main-navigation__item-count">${watchlist.count}</span></a>
      <a href="#history" class="main-navigation__item ${currentFilterType === FilterType.HISTORY ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.HISTORY}">${history.name} <span class="main-navigation__item-count">${history.count}</span></a>
      <a href="#favorites" class="main-navigation__item ${currentFilterType === FilterType.FAVORITE ? 'main-navigation__item--active' : ''}" data-filter-type="${FilterType.FAVORITE}">${favorite.name} <span class="main-navigation__item-count">${favorite.count}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class MenuView extends AbstractView{
  #filters = null;
  #currentFilterType = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createMenuTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.querySelector('.main-navigation__items').addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }
}
