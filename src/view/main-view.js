import AbstractView from './abstract-view.js';

const createMainTemplate = () => (
  `<section class="films">
    <section class="films-list">

    </section>
  </section>`
);

export default class MainView extends AbstractView{
  get template() {
    return createMainTemplate();
  }
}
