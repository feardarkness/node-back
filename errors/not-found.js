class NotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'Not found';
  }
}

module.exports = NotFound;
