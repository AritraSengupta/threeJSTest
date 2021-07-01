export class LoaderStatus {
  constructor() {
    this.ids = [];
  }

  addId(id) {
    !this.ids.includes(id) && this.ids.push(id);
  }

  addIds(arrayId) {
    this.ids = [...this.ids, ...arrayId];
  }

  removeId(id) {
    this.ids = this.ids.filter(i => i !== id);
  }

  get loadingArray() {
    return this.ids;
  }
}
