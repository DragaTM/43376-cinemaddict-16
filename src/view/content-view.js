import AbstractView from './abstract-view.js';

const createContentTemplate = () => (
  `<section class="films">
    <section class="films-list">

      <div class="films-list__container">
        
      </div>
    </section>
  </section>`
);

export default class ContentView extends AbstractView{
  get template() {
    return createContentTemplate();
  }
}
