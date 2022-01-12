import AbstractView from './abstract-view.js';
import {FilterType} from '../const.js';

const emptyTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITE]: 'There are no favorite movies now',
};

const createEmptyTemplate = (filterType) => {
  const emptyTextValue = emptyTextType[filterType];

  return `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${emptyTextValue}</h2>
    </section>
  </section>`;
};

export default class EmptyView extends AbstractView{
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createEmptyTemplate(this._data);
  }
}
