export default class NotificationMessage {

  constructor(note, {
    duration = 0,
    type = ''
  } = {}) {
    this.duration = duration;
    this.type = type;
    this.note = note;
    this.render();
  }

  get template() {
    let value = (this.duration / 1000) + 's';
    return `
  <div class="notification ${this.type}" style="--value: ${value}">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
        ${this.note}
      </div>
    </div>
  </div>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }

  show() {
    document.querySelectorAll('.notification').forEach((a) => a.remove());
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
    document.body.append(element);
    setTimeout(() => this.remove(), this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.element.remove();
    this.element = null;
  }
}

