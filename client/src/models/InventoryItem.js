class InventoryItem {
  constructor(data = {}) {
    this._id = data._id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.quantity = data.quantity || 0;
    this.price = data.price || 0;
    this.category = data.category || '';
    this.location = data.location || '';
  }

  validate() {
    const errors = [];
    if (!this.name) errors.push('Name is required');
    if (this.quantity < 0) errors.push('Quantity must be positive');
    if (this.price < 0) errors.push('Price must be positive');
    if (!this.category) errors.push('Category is required');
    return errors;
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      quantity: Number(this.quantity),
      price: Number(this.price),
      category: this.category,
      location: this.location
    };
  }
}

export default InventoryItem;
