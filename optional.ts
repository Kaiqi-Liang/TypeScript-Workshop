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

console.log(new Optional()); // { value: null }
console.log(new Optional(1)); // { value: 1 }
console.log(new Optional('')); // { value: '' }