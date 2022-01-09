import AbstractView from './abstract-view.js';

const createMenuTemplate = () => (
  `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

export default class MenuView extends AbstractView{
  get template() {
    return createMenuTemplate();
  }
}
