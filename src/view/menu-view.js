import AbstractView from './abstract-view.js';
import {MenuItem} from '../const.js';

const createMenuTemplate = () => (
  `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional" data-menu-item="${MenuItem.STATS}">Stats</a>
  </nav>`
);

export default class MenuView extends AbstractView{
  get template() {
    return createMenuTemplate();
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.addEventListener('click', this.#menuClickHandler);
  };

  #menuClickHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }
}
