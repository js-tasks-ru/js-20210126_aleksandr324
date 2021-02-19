import fetchJson from './utils/fetch-json.js';

export default class ColumnChart {
  subElements = {};
  chartHeight = 50;
  data = [];
  value;

  constructor({
    url = '',
    range = {},
    label = ''
  } = {}) {
    this.url = url;
    this.range = range;
    this.label = label;
    this.render();
  }

  getColumnBody(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data
      .map(item => {
        const percent = (item / maxValue * 100).toFixed(0);

        return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
      })
      .join('');
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  getHeader() {
    return `<div data-element="header" class="column-chart__header">
             ${this.value}
           </div>`;
  }

  get template() {

    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
                     ${this.getHeader()}
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnBody(this.data)}
          </div>
        </div>
      </div>
    `;
  }

  render() {

    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);

    this.renderWithData();
  }

  renderWithData() {
    let urls = new URL(this.url, 'https://course-js.javascript.ru');
    urls.searchParams.set('from', this.range.from);
    urls.searchParams.set('to', this.range.to);

    fetchJson(urls).then(result => {
      Object.values(result).forEach((a) => this.data.push(a));
      this.value = [...this.data].reduce((sum, current) => sum + current);
      this.updateWithData();
    });
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  update(from, to) {
    this.range.from = from;
    this.range.to = to;
    this.renderWithData();
  }

  updateWithData() {
    this.subElements.header.innerHTML = this.getHeader(this.data);
    this.subElements.body.innerHTML = this.getColumnBody(this.data);
    this.element.classList.remove('column-chart_loading');
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
