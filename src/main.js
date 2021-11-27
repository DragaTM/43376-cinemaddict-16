import {createProfileTemplate} from './view/profile-view.js';
import {createMenuTemplate} from './view/menu-view.js';
import {createSortTemplate} from './view/sort-view.js';
import {createContentTemplate} from './view/content-view.js';
import {createCardTemplate} from './view/card-view.js';
import {createShowMoreBtnTemplate} from './view/show-more-btn-view.js';
import {createRatedTemplate} from './view/rated-view.js';
import {createCommentedTemplate} from './view/commented-view.js';
import {createStatTemplate} from './view/stat-view.js';
import {createDetailsTemplate} from './view/details-view.js';
import {renderTemplate, renderPosition} from './render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

renderTemplate(siteHeaderElement, createProfileTemplate(), renderPosition.BEFOREEND);
renderTemplate(siteMainElement, createSortTemplate(), renderPosition.BEFOREEND);
renderTemplate(siteMainElement, createMenuTemplate(), renderPosition.BEFOREEND);
renderTemplate(siteMainElement, createContentTemplate(), renderPosition.BEFOREEND);

const siteFilmsElement = document.querySelector('.films');
const siteListElement = siteFilmsElement.querySelector('.films-list__container');
const FILM_COUNT = 5;

for (let i = 0; i < FILM_COUNT; i++) {
	renderTemplate(siteListElement, createCardTemplate(), renderPosition.BEFOREEND);
}

renderTemplate(siteListElement, createShowMoreBtnTemplate(), renderPosition.AFTEREND);
renderTemplate(siteFilmsElement, createRatedTemplate(), renderPosition.BEFOREEND);

const siteRatedFilmsElement = document.querySelector('.films-list--rated .films-list__container');

const RATED_COUNT = 2;
for (let i = 0; i < RATED_COUNT; i++) {
	renderTemplate(siteRatedFilmsElement, createCardTemplate(), renderPosition.BEFOREEND);
}

renderTemplate(siteFilmsElement, createCommentedTemplate(), renderPosition.BEFOREEND);

const siteCommentedFilmsElement = document.querySelector('.films-list--commented .films-list__container');

const COMMENTED_COUNT = 2;
for (let i = 0; i < COMMENTED_COUNT; i++) {
	renderTemplate(siteCommentedFilmsElement, createCardTemplate(), renderPosition.BEFOREEND);
}

const siteFooterStatElement = document.querySelector('.footer__statistics');
renderTemplate(siteFooterStatElement, createStatTemplate(), renderPosition.BEFOREEND);


