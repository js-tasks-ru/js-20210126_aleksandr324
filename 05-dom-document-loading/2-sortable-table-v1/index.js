export default class SortableTable {

  sortedData = [];

  constructor(
      header = [],
    {
      data = []
    } = {}) {

    this.header = header;
    this.data = data;
    this.sortedData = data;
    this.render();
  }

  getHeader(header) {
    return header
      .map(item => {
        return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="false" data-order="asc">
        <span>${item.title}</span>
      </div>`;
      })
      .join('');
  }

  getRows(header, oneI) {
    return header
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


  getBody(header, data) {
    return data
      .map(item => {
        return `<a href="" class="sortable-table__row">
         ${this.getRows(header, item)}
         </a>`;}).join('');
  }

  get template() {
    return `
<div data-element="productsContainer" class="products-list__container">
  <div class="sortable-table">
    <div data-element="header" class="sortable-table__header sortable-table__row">
     ${this.getHeader(this.header)}
     </div>
     <div data-element="body" class="sortable-table__body">
          ${this.getBody(this.header, this.sortedData)}
    </div>
  </div>
</div>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    document.body.append(element);
  }

  sort(field, order) {
    this.remove();
    let arr;
    if (typeof this.sortedData[0][field] === "number") {
      arr = [...this.sortedData].sort((prev, next) => prev[field] - next[field]);
    } else {
      arr = [...this.sortedData].sort((prev, next) => ('' + prev[field]).localeCompare(next[field]));
    }
    this.sortedData = order === 'asc' ? arr : arr.reverse();
    this.render();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

