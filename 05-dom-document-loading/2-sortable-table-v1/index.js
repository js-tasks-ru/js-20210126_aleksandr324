export default class SortableTable {
  element;
  subElements = {};

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
        return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
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
  }

  sort(field, order) {

    let sortedData;
    const direction = order === 'asc' ? 1 : -1;
    if (typeof this.data[0][field] === "number") {
      sortedData = [...this.data].sort((prev, next) => direction * (prev[field] - next[field]));
    } else {
      sortedData = this.sortStrings(this.data, order, field);
    }

    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    // NOTE: Remove sorting arrow from other columns
    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.getBody(sortedData);
  }

  sortStrings(arr, param, field) {
    switch (param) {
    case 'asc':
      return sortArray(arr, 1, field);
    case 'desc':
      return sortArray(arr, -1, field);
    default:
      return arr;
    }

    function sortArray(array, direction, field) {
      return [...array].sort((string1, string2) =>
        direction * string1[field].localeCompare(string2[field], ['ru']));
    }
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  initEventListeners () {
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}

