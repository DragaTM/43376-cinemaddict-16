import AbstractView from './abstract-view.js';
import {MenuItem, isClickOnTab} from '../const.js';

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

  #menuClickHandler = (e) => {
    if (isClickOnTab(e)) {
      return;
    }

    e.preventDefault();
    this._callback.menuClick(e.target.dataset.menuItem);
  }
}
