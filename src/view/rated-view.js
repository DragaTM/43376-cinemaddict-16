import AbstractView from './abstract-view.js';

const createRatedTemplate = () => (
  `<section class="films-list films-list--rated films-list--extra">
    <h2 class="films-list__title">Top rated</h2>

    <div class="films-list__container">
      
    </div>
  </section>`
);

export default class RatedView extends AbstractView{
  get template() {
    return createRatedTemplate();
  }
}
