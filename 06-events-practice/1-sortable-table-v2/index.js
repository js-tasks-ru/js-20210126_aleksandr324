export default class SortableTable {
  element;
  subElements = {};
  lastSortedRaw = '';
  orderRaw = 'desc';

  constructor(
    header = [],
    {
      data = []
    } = {}) {

    this.header = header;
    this.data = data;
    this.render();
  }

  getHeader(header) {
    return header
      .map(item => {
        return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="">
        <span>${item.title}</span>
        ${this.getHeaderSortingArrow()}
      </div>`;

      })
      .join('');
  }

  getHeaderSortingArrow() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>`;
  }

  getRows(oneI) {
    return [...this.header]
      .map(item => {
        if (item.id === 'images') {
          return `<div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src="${oneI.images[0].url}">
        </div>`;
        } else {
          return `<div class="sortable-table__cell">${oneI[item.id]}</div>`;

        }
      })
      .join('');
  }


  getBody(data) {
    return data
      .map(item => {
        return `<a href="" class="sortable-table__row">
         ${this.getRows(item)}
         </a>`;
      }).join('');
  }

  get template() {
    return `
<div data-element="productsContainer" class="products-list__container">
  <div class="sortable-table">
    <div data-element="header" class="sortable-table__header sortable-table__row">
     ${this.getHeader(this.header)}
     </div>
     <div data-element="body" class="sortable-table__body">
          ${this.getBody(this.data)}
    </div>
  </div>
</div>
    `;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.template;

    const element = wrapper.firstElementChild;
    this.element = element;

    this.subElements = this.getSubElements(element);
    this.subElements.header.addEventListener('pointerdown', (event) => this.dispatchEvent(event));
  }

  sort(field, order) {

    let sortedData = this.sortArr(order, field);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');

    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field === 'Name' ? 'title' : field.toLowerCase()}"]`);
    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.getBody(sortedData);
  }

  sortArr(order, field) {
    const column = this.header.find(item => item.title === field);
    console.log(field);

    const {sortType, customSorting} = column;
    console.log(sortType);

    const direction = order === 'asc' ? 1 : -1;

    switch (sortType) {
    case 'number':
      return [...this.data].sort((prev, next) => direction * (prev[field.toLowerCase()] - next[field.toLowerCase()]));
    case 'string':
      return [...this.data].sort((string1, string2) => direction * string1.title.localeCompare(string2.title, ['ru']));
    case 'custom':
      return direction * customSorting(a, b);
    default:
      return direction * (a[field] - b[field]);
    }
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  dispatchEvent(event) {
    switch(event.type) {
    case 'pointerdown':
      if (event.target.innerHTML === this.lastSortedRaw) {
        this.orderRaw = 'desc' === this.orderRaw ? 'asc' : 'desc';
      } else {
        this.orderRaw = 'desc';
        this.lastSortedRaw = event.target.innerHTML;
      }
      this.sort(this.lastSortedRaw, this.orderRaw);
      break;
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
