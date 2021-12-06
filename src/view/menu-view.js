import {createElement} from '../render.js';

const createMenuTemplate = (counts) => (`<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${counts.watchlist}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${counts.history}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${counts.favorite}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class MenuView {
  #element = null;
  #counts = null;

  constructor(counts) {
    this.#counts = counts;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    
    return this.#element;
  }

  get template() {
    return createMenuTemplate(this.#counts);
  }

  removeElement() {
    this.#element = null;
  }
}
