import AbstractView from './abstract-view.js';

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

export default class MenuView extends AbstractView{
  #counts = null;

  constructor(counts) {
    super();
    this.#counts = counts;
  }

  get template() {
    return createMenuTemplate(this.#counts);
  }
}
