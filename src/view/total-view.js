import {createElement} from '../render.js';

const createTotalTemplate = (totalCount) => (
  `<p>${totalCount} movies inside</p>`
);

export default class TotalView {
  #element = null;
  #totalCount = null;

  constructor(totalCount) {
    this.#totalCount = totalCount;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createTotalTemplate(this.#totalCount);
  }

  removeElement() {
    this.#element = null;
  }
}
