export default class NotificationMessage {
  static activeNotification;

  constructor(note, {
    duration = 2000,
    type = 'success'
  } = {}) {

    if (NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification.remove();
    }

    this.duration = duration;
    this.type = type;
    this.note = note;
    this.durationInSeconds = (duration / 1000) + 's';

    this.render();
  }

  get template() {
    return `
  <div class="notification ${this.type}" style="--value: ${this.durationInSeconds}">
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
    NotificationMessage.activeNotification = this.element;

  }

  show(parent = document.body) {
    parent.append(this.element);
    setTimeout(() => this.remove(), this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.element.remove();
    NotificationMessage.activeNotification = null;
  }
}

