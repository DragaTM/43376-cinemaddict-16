import {createElement} from '../render.js';

const createTotalTemplate = (all) => (
  `<p>${all} movies inside</p>`
);

export default class TotalView {
  #element = null;
  #all = null;

  constructor(all) {
    this.#all = all;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    
    return this.#element;
  }

  get template() {
    return createTotalTemplate(this.#all);
  }

  removeElement() {
    this.#element = null;
  }
}