import SmartView from './smart-view.js';
import {calculationRank, getGenresInfo} from '../utils.js';
import {isClickOnInput} from '../const.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const createStatsTemplate = (currentPeriod, rank, filmsPerPeriod, duration, topGenre) => (`<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all" ${currentPeriod === 'all' ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="day" ${currentPeriod === 'day' ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${currentPeriod === 'week' ? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${currentPeriod === 'month' ? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${currentPeriod === 'year' ? 'checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${filmsPerPeriod} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${duration}</p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`);

export default class StatsView extends SmartView {
  #films = [];
  #rank = '';
  #currentPeriod = 'all';
  #filmsPerPeriodCount = 0;
  #duration = 0;
  #genresList = null;
  #genresCounts = 0;
  #topGenre = '';

  constructor(films) {
    super();

    this.#films = films;
    const watchedCount = this.#films.filter((film) => film.isWatched).length;
    this.#rank = calculationRank(watchedCount);
    this.createStats();
    this.restoreHandlers();
    this.#setCharts();
  }

  get template() {
    return createStatsTemplate(this.#currentPeriod, this.#rank, this.#filmsPerPeriodCount, this.#duration, this.#topGenre);
  }

  removeElement = () => {
    super.removeElement();
  }

  createStats = () => {
    const filterFilmsByPeriod = (films, period) => films.filter(({watchingDate}) => dayjs(watchingDate).isBetween(dayjs().subtract(1, period), dayjs()));
    let filmsPerPeriod = filterFilmsByPeriod(this.#films, this.#currentPeriod);

    if (this.#currentPeriod === 'all') {
      filmsPerPeriod = this.#films;
    }

    this.#filmsPerPeriodCount = filmsPerPeriod.length;

    let totalTime = 0;

    filmsPerPeriod.forEach((film) => {
      totalTime += film.time;
    });

    const timeHours = Math.trunc(totalTime / 60);
    const timeMinutes = totalTime % 60;

    if (timeHours > 0) {
      this.#duration = `${timeHours} <span class="statistic__item-description">h</span> ${timeMinutes} <span class="statistic__item-description">m</span>`;
    } else {
      this.#duration = `${timeMinutes} <span class="statistic__item-description">m</span>`;
    }

    const genresData = getGenresInfo(filmsPerPeriod);

    this.#genresList = Object.keys(genresData).sort((firstGenre, secondGenre) => genresData[secondGenre] - firstGenre[secondGenre]);
    this.#genresCounts = Object.values(genresData).sort((firstCount, secondCount) => secondCount - firstCount);
    this.#topGenre = filmsPerPeriod.length > 0 ? this.#genresList[0] : '';
    this.updateElement();
    this.#setCharts();
  }

  restoreHandlers = () => {
    this.element.querySelector('.statistic__filters').addEventListener('click', this.#onClickStatMenu);
  }

  #onClickStatMenu = (evt) => {
    evt.preventDefault();

    if (isClickOnInput(evt)) {
      const periodElement = this.element.querySelector(`#${evt.target.getAttribute('for')}`);

      if (periodElement === null) {
        return;
      }
      const period = periodElement.value;

      if (period !== this.#currentPeriod) {
        this.#currentPeriod = period;
        this.createStats();
      }
    }
  }

  #setCharts = () => {
    const BAR_HEIGHT = 50;
    const statisticCtx = this.element.querySelector('.statistic__chart');

    statisticCtx.height = BAR_HEIGHT * this.#genresList.length;

    new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: this.#genresList,
        datasets: [{
          data: this.#genresCounts,
          backgroundColor: '#ffe800',
          hoverBackgroundColor: '#ffe800',
          anchor: 'start',
          barThickness: 24,
        }],
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              size: 20,
            },
            color: '#ffffff',
            anchor: 'start',
            align: 'start',
            offset: 40,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#ffffff',
              padding: 100,
              fontSize: 20,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  }
}
