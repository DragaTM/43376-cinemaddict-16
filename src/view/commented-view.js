import AbstractView from './abstract-view.js';

const createCommentedTemplate = () => (
  `<section class="films-list films-list--commented films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container">
        
      </div>
    </section>`
);

export default class CommentedView extends AbstractView{
  get template() {
    return createCommentedTemplate();
  }
}
