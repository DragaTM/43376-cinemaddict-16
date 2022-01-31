import AbstractView from './abstract-view.js';

const createFilmsListTemplate = () => (
  '<div class="films-list__container"></div>'
);

export default class FilmsListView extends AbstractView{
  get template() {
    return createFilmsListTemplate();
  }
}
