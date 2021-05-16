# TypeScript Workshop
## JavaScript Concepts
JavaScript is a dynamically typed language.

You can change the type of a variable or add new properties or methods to an object after it's been declared.

Basically you can think of every varible in JavaScript as of type `any`.

You can only see JavaScript errors when you run it, for example typos and redeclaring a `const` variable, the former will just give you an `undefined` if you misspelt a varible name that doesn't exist, the latter will crash horribly and yell at you. 😫 

## JavaScript Types
### Some common Primitives
* `number`
> includes both int and float
* `string`
> includes char (a string with 1 character in it)
* `boolean`
> true/false
* `null`
> a lot of functions return null to indicate it failed or something that you tried to get doesn't exist
```javascript
localStorage.getItem('');
```
* `undefined`
> when you try to access a field in an object that doesn't exist, or an array with an index out of range, try to avoid it in TypeScript

## TypeScript Concepts
TypeScript is a superset of JavaScript, it allows you to add static typing.

TypeScript gets transpiled to JavaScript so that it can be run on either the browser or `node.js`.

### Type Inference
You don't have to annoatate types for every single variable to utilise TypeScript's static typing feature.

In fact if you get nothing out of today's workshop you can still start flexing that you know TypeScript by just writing Vanilla JavaScript in a `ts` file and purely relies on `Type Inference` to give you the static typing ability. 😜

## TypeScript Types
### Basic Types
#### JavaScript Primitives
They all have the same names as what `typeof` in JavaScript returns.
```typescript
let num: number = 42;
num = 0; // no error
// num = '0'; // error
```

#### any
You can think of all the variables in Vanilla JavaScript are of type `any`.
```typescript
let num: any = 42;
num = '0'; // no error
```
When you don’t specify a type, and TypeScript can’t `infer` it from context, the compiler will typically default to `any`.
```typescript
const add = (a, b) => a + b;
```

#### never
```typescript
let never: never;
/* whatever you try to assign to this type it won't work
none = 0;
none = '';
none = undefined;
none = null;
*/
```

#### Array
```typescript
let numbers: number[] = [];
numbers = [1, 2]; // no error
// numbers = [1, '2']; // error
// numbers.push('2'); // error
```

#### Function
```typescript
/**
 * `Type Inference`
 *
 * If you hover over `add` and `res` you'll see its type.
 * The return value of the function is `inferred`.
 */
const add = (a: number, b: number) => a + b;
const res: number = add(1, 2); // no error
// add('1', 2); // error
// add(1); // error
```

### Custom Types
#### Interface
```typescript
interface Props {
    readonly state: number; // cannot be modified
    setState: (newState: number) => void;
}

/**
 * Extending the `Props Interface` defined previously
 */
interface Props {
    render?: boolean; // optional
}

let props: Props = {
    // render: true,
    state: 0,
    setState: () => {}, // no error
    // setState: (a, b) => {}, // error
};
console.log(props.state, props.setState); // no error
// props.state = 0; // error
```

#### Type Alias
##### Tuple
```typescript
type State = [number, (newState: number) => void];

type Tuple = [number, string, boolean];
let tuple: Tuple = [1, '2', true]; // no error
// let tuple: Tuple = [1, 2]; // error
// let tuple: Tuple = [1, '2']; // error
```

##### Intersection
```typescript
type None = number & string; // no intersection between these 2 types
let none: None; // never

interface Render {
    render: boolean;
}
type MoreProps = Props & Render;
let moreProps: MoreProps = {
    render: false,
    state: 1,
    setState: (num) => console.log(num),
};
```

##### Union
```typescript
type Data = number | string;
let data: Data;
data = 1;
data = '';

if (typeof data === 'string') {
    console.log(data.length);
} else if (typeof data === 'number') {
    console.log(Math.round(data)); // hover over round
}

type Bit = 0 | 1;
let bit: Bit = 1;
bit = 0;

interface Render {
    render: boolean;
}
type RenderProps = Props | Render;
let renderProps: RenderProps = { render: false };
```

Union and Intersection can also be constructed with values
```typescript
type Bit = 0 | 1;
let bit: Bit = 1;
bit = 0;

type Hex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
type or = Bit | Hex;
type and = Bit & Hex;
```

#### Anonymous
```typescript
type Input = (number | string)[];
// type Input = Data[]
let inputs: Input = [];
inputs = [0];
inputs.push(1);
inputs.push('2');

type Objects = { value: number; }[]
let objects: Objects = [];
objects.push({ value: 0 }); // no error
// objects.push(0); // error
```

#### Generics
```typescript
let strings: Array<string> = ['1', '2'];
strings[0] = '';
// strings[1] = 1; // error

type setState<T> = (newState: T) => void;
interface State<T> {
    state: T;
    setState: setState<T>;
}

const setState = <T>(newState: T) => console.log(newState);
const useState: State<number> = {
    state: 0,
    setState: setState,
}
```

#### Class
```typescript
class LinkedList {
    private value: number;
    protected next: LinkedList<T>;
    constructor(value: number = 0) {
        this.next = null;
        this.value = value;
    }
    public head() { return this.value; }
    public add(value: number) {
        let curr: LinkedList = this;
        while (curr.next) curr = curr.next;
        curr.next = new LinkedList(value);
    }
    public display() {
        let curr: LinkedList = this;
        while (curr) {
            console.log(curr.value);
            curr = curr.next;
        }
    }
}
const linkedList = new LinkedList();
console.log(linkedList.head()); // 0
linkedList.add(1);
// linkedList.add(''); // error
linkedList.display();
// console.log(linkedList.value); // error
```

Clean up using TypeScript's syntactic sugar and generics
```typescript
type Next<T extends Data> = LinkedList<T> | null;
class LinkedList<T extends Data> {
    protected next: Next<T> = null;
    constructor(private value: T) {}
    head() { return this.value; }
    add(value: T) {
        let curr: LinkedList<T> = this;
        while (curr.next) curr = curr.next;
        curr.next = new LinkedList(value);
    }
    display() {
        let curr: Next<T> = this;
        while (curr) {
            console.log(curr.value);
            curr = curr.next;
        }
    }
}
const linkedList = new LinkedList<string>('a');
// const linkedList = new LinkedList(0); // no error
// const linkedList = new LinkedList(true); // error
console.log(linkedList.head()); // a
linkedList.add('b');
// linkedList.add(0); // error
linkedList.display();
```

TypeScript also supports a lot of the concepts from Java
* abstract class
* a class can extend another class
* a class can implement an interface
* an interface can extend another interface
* an interface can extend a class
> :o WHAT 😱

Differences between Type Alias and Interface
```typescript
type Type<T> = {
    name: T;
    method: (arg: T) => T;
}

interface Interface<T> {
    name: T;
    method: (arg: T) => T;
}
```
What's the difference?
> No difference here but the convention is to use interface to define data shapes, for example, an object. Below are some of the features that one might have but not the other.
* Interface:
    * declaration merging
    * extends & implements
* Type Alias
    * tuple
    * intersection
    * union


## Installation
* node.js
> Install `node` at [nodejs.org](https://nodejs.org)
* tsc
> Install `tsc` using `npm`, for more info see [typescriptlang.org](https://www.typescriptlang.org/download)
```shell
npm install typescript
```

## Compilation
```shell
tsc [-w] file.ts
```
This will give you a JavaScript file `file.js` and then you can either run it with `node file.js` or include it in a `HTML` page using a script tag.
```html
<script src="script.js"></script>
```

`tsconfig.json` is a config file that can allow you to specify complier options for example turning on the strict mode.
```json
{
    "compilerOptions": {
        "strict": true
    }
}
```