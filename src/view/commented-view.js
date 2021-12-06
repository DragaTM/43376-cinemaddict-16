import {createElement} from '../render.js';

const createCommentedTemplate = () => (
  `<section class="films-list films-list--commented films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container">
        
      </div>
    </section>`
);

export default class CommentedView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createCommentedTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
