import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  data = {};
  categories = [];

  constructor (productId = '') {
    this.productId = productId;
    this.url = new URL('api/rest/products', BACKEND_URL);
    this.urlCategories = new URL('api/rest/categories', BACKEND_URL);
    this.initEventListeners();

  }

  async render () {
    const element = document.createElement('div');
    this.urlCategories.searchParams.set('_sort', 'weight');
    this.urlCategories.searchParams.set('_refs', 'subcategory');

    await fetchJson(this.urlCategories).then(result => {
      Object.values(result).forEach((a) => this.categories.push(a));
    });

    if (this.productId !== '') {
      this.url.searchParams.set('id', this.productId);
    }
    await fetchJson(this.url).then(result => {
      this.data = result[0];
    });

    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);

    this.subElements.productForm.status.value = 1;
    this.subElements.productForm.subcategory.value = this.data.subcategory;
    this.subElements.productForm.title.value = this.data.title;
    this.subElements.productForm.description.value = this.data.description;
    this.subElements.productForm.quantity.value = this.data.quantity;
    this.subElements.productForm.price.value = this.data.price;
    this.subElements.productForm.discount.value = this.data.discount;
    this.initEventListeners();

  }


  getTitle() {
    return `<fieldset>
          <label class="form-label">${this.data.title}</label>
          <input required="" type="text" name="title" class="form-control" placeholder="Название товара">
        </fieldset>`;
  }

  getDescription() {
    return `<label class="form-label">Описание</label>
        <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
      `;
  }
  getQuantity() {
    return `<label class="form-label">Количество</label>
        <input required="" type="number" class="form-control" name="quantity" placeholder="1">`;
  }
  getPriceDiscount() {
    return `<fieldset>
          <label class="form-label">Цена ($)</label>
          <input required="" type="number" name="price" class="form-control" placeholder="100">
        </fieldset>
        <fieldset>
          <label class="form-label">Скидка ($)</label>
          <input required="" type="number" name="discount" class="form-control" placeholder="0">
        </fieldset>`;
  }

  getState() {
    return `<label class="form-label">Статус</label>
        <select class="form-control" name="status">
          <option value="1">Активен</option>
          <option value="0">Неактивен</option>
        </select>`;
  }

  getCategories() {
    return [...this.categories]
      .map(item => {
        return this.getSubCategories(item);
      })
      .join('');
  }

  getSubCategories(item) {
    return [...item.subcategories]
      .map(sub => {
        return `<option value="${sub.id}">${item.title} &gt; ${sub.title}</option>`;
      })
      .join('');
  }

  getImage() {
    return [...this.data.images]
      .map(img => {
        return `<li class="products-edit__imagelist-item sortable-list__item" style="">
                <input type="hidden" name="url" value="${img.url}">
                <input type="hidden" name="source" value="${img.source}">
                <span>
                  <img src="icon-grab.svg" data-grab-handle="" alt="grab">
                  <img class="sortable-table__cell-img" alt="Image" src="${img.url}">
                  <span>${img.source}</span>
                </span>
                <button type="button">
                  <img src="icon-trash.svg" data-delete-handle="" alt="delete">
                </button>
              </li>`;
      })
      .join('');
  }

  get template() {
    return `
<div class="product-form">
    <form data-element="productForm" class="form-grid">
      <div class="form-group form-group__half_left">
          ${this.getTitle()}
      </div>
      <div class="form-group form-group__wide">
          ${this.getDescription()}
      </div>
      <div class="form-group form-group__wide" data-element="sortable-list-container">
        <label class="form-label">Фото</label>
          <div data-element="imageListContainer">
            <ul class="sortable-list">
              ${this.getImage()}
            </ul>
          </div>
        <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
      </div>
      <div class="form-group form-group__half_left">
        <label class="form-label">Категория</label>
        <select class="form-control" name="subcategory">
                  ${this.getCategories()}
        </select>
      </div>
      <div class="form-group form-group__half_left form-group__two-col">
          ${this.getPriceDiscount()}
      </div>
      <div class="form-group form-group__part-half">
          ${this.getQuantity()}
      </div>
      <div class="form-group form-group__part-half">
          ${this.getState()}
      </div>
      <div class="form-buttons">
        <button type="submit" name="save" class="button-primary-outline">
          Сохранить товар
        </button>
      </div>
    </form>
  </div>
    `;
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  async uploadFile(file) {

    const formData = new FormData();

    formData.append('image', file);
    formData.append('name', 'John');

    try {
      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
        },
        body: formData,
      });

      return await response.json();
    } catch (err) {
      throw err;
    }
  }

  async upload() {
    alert('Загружаем...');

    let result;

    try {
      const [file] = this.subElements.productForm.uploadImage.files;
      result = await this.uploadFile(file);

      alert('Изображение загружено');
    } catch(err) {
      alert('Ошибка загрузки изображения');
      console.error(err);
    } finally {
      alert('Готово!');
    }

    console.log(result);
  }

  async initEventListeners() {
    if (this.subElements !== undefined) {
      console.log(this.subElements.productForm.uploadImage);
      this.subElements.productForm.uploadImage.addEventListener('onchange', this.upload);
    }
  }

  update(from, to) {
    this.range.from = from;
    this.range.to = to;
    this.renderWithData();
  }


  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
