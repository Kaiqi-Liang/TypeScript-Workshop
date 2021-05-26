/**
 * initial value optional,
 * default to `null` if not specified
 */
class Optional<T> {
  private value: T = null;
  constructor(value?: T) {
    if (value !== undefined) this.value = value;
  }
}

const option = new Optional();
console.log(option);