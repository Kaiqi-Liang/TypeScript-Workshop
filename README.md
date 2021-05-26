# TypeScript Workshop
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
This will give you a JavaScript file `file.js` and then you can either run it with `node file.js` or include it in a `HTML` page using a script tag
```html
<script src="script.js"></script>
```

## JavaScript Concepts
JavaScript is a dynamically typed language

You can change the type of a variable or add new properties or methods to an object after it's been declared

Basically you can think of every variable in JavaScript as of type `any`

You can only see JavaScript errors when you run it, for example typos and redeclaring a `const` variable, the former will just give you an `undefined` if you misspelt a field name that doesn't exist in an `object`, the latter will crash horribly and yell at you 😫

## JavaScript Types
### Some common Primitives
* `number`
> it's actually just `double` which can be used to represent both integers and floating point numbers but with less precision
* `string`
> includes `char` (a string with a single character in it)
* `boolean`
> `true` or `false`
* `null`
> a lot of functions return null to indicate it failed or something that you tried to get doesn't exist
```javascript
localStorage.getItem('');
```
* `undefined`
> when you try to access a field in an object that doesn't exist, or an element in an array with an index out of range, this is what we are trying to avoid in TypeScript

## TypeScript Concepts
TypeScript is a superset of JavaScript, it allows you to add static typing

TypeScript gets transpiled to Vanilla JavaScript so that it can be run on either the browsers or `node.js`. You can specify the version of JavaScript that it transpiles into which allows you to use `tsc` purely as a transpiler for browser compatibility (not what TypeScript is built for and definitely not as good as `babel` but it's another perk that's worth mentioning)

### Type Inference
You don't have to `annoatate` types for every single variable to utilise TypeScript's static typing feature

In fact if you get nothing out of today's workshop you can still start flexing that you know TypeScript by just writing Vanilla JavaScript in a `ts` file and purely relies on `Type Inference` to give you the static typing ability 😜

## TypeScript Types
### Basic Types
#### JavaScript Primitives
They all have the same names as what `typeof` in JavaScript returns
```typescript
let num = 42;
num = 0; // no error
// num = '0'; // error

let tf: boolean = true;
tf = false; // no error
// tf = 0; // error
```

#### Any
```typescript
let num: any = 42;
num = '0'; // no error
```
When you don’t specify a type, and TypeScript can’t `infer` it from context, the compiler will typically default to `any`, this is most common in function paramaters
```typescript
/**
 * `const add: (a: any, b: any) => any`
 */
const add = (a, b) => a + b;
```

#### Array
```typescript
// let numbers: number[] = ['0']; // error
let numbers: number[] = [];
numbers = [1, 2]; // no error
// numbers = [1, '2']; // error
// numbers.push('2'); // error
```

#### Function
`Parameter Type Annotations` is where TypeScript is most frequently utilised because it is mandotary. Much like variable type annotations, you usually don’t need a return type annotation because TypeScript will `infer` the function’s return type based on its `return` statements
```typescript
/**
 * `Type Inference`
 *
 * If you hover over `add` and `res` you'll see its type.
 * The return value of the function is `inferred`.
 */
const add = (a: number, b: number) => a + b;
const res = add(1, 2); // no error
// add('1', 2); // error
// add(1); // error

/**
 * Older syntax
 */
function sub(a: number, b: number) {
    return a - b;
}
```

### Custom Types
#### Interface
```typescript
interface Props {
    readonly state: number; // cannot be modified
    setState: (newState: number) => void;
}

const component = (props: Props) => {
    props.setState(props.state); // no error
    // props.state = 0; // error
};

/**
 * `Declaration Merging`
 *
 * Extending the `Props Interface` defined previously.
 * Do not do this unless for an `interface` imported from a library.
 */
interface Props {
    render?: boolean; // optional
}

const props: Props = {
    // render: true, // optional
    state: 0,
    setState: (n) => console.log(n), // no error
    // setState: (a, b) => {}, // error
}

/* `props.render` could be `undefined` */
console.log(props.state, props.render); // no error
```

#### Type Alias
```typescript
type Bool = boolean;
let bool: Bool = true; // no error
// bool = 0; // error

type setState = (newState: number) => void;
```

##### Tuple
```typescript
/**
 * This is what `React.useState` returns,
 * a `tuple`.
 */
type state = [number, setState];
// const useState: state = [1, 2]; // error

type Tuple = [number, string, boolean];
const tuple: Tuple = [1, '2', true]; // no error
// const tuple: Tuple = [1, '2']; // error
```

##### Intersection
```typescript
interface Props {
    render?: boolean; // optional
    readonly state: number; // cannot be modified
    setState: (newState: number) => void;
}
interface MoreState {
    state: number;
    moreState: string;
}
type MoreProps = Props & MoreState;
const moreProps: MoreProps = {
    // render: false, // optional
    moreState: '',
    state: 1,
    setState: (n) => console.log(n),
};

type None = number & string; // no intersection between these 2 types
let none: None; // never
/* whatever you try to assign to this type it won't work
none = 0;
none = '';
none = undefined;
none = null;
```

##### Union
`Union` introduces something called `narrowing`
```typescript
type Data = number | string;
let data: Data;
data = 1; // no error
data = ''; // no error
// data = true; // error

const transformData = (data: Data) => {
    // return data.length; // error
    if (typeof data === 'string') {
        return data.length; // no error
    } else if (typeof data === 'number') {
        // return data.length; // error
        return Math.round(data); // no error
    }
}

interface Props {
    render?: boolean; // optional
    readonly state: number; // cannot be modified
    setState: (newState: number) => void;
}
interface MoreState {
    state: number;
    moreState: string;
}
type CommonProps = Props | MoreState;
const useProps = (commonProps: CommonProps) => {
    console.log(commonProps.state);
    // commonProps.setState(0); // error
    if ('setState' in commonProps) {
        commonProps.setState(0); // no error
        // console.log(commonProps.moreState); // error
    } else {
        console.log(commonProps.moreState); // no error
    }
}
```

`Union` and `Intersection` can also be constructed with values
```typescript
/**
 * The type `boolean` itself is actually just an `alias` for the `union`,
 * true` | `false`.
 */
const bool: boolean;
type boolean = true | false;
```
* `Union` is more commonly used for primitive types to build up more complex types
* `Intersection` is used for complex types and interfaces to build up more restrictive types
```typescript
type Bit = 0 | 1;
let bit: Bit = 1;
bit = 0;

type Hex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
type or = Bit | Hex;
type and = Bit & Hex;
```

Differences between `Type Alias` and `Interface`
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
> No difference here but the convention is to use `interface` to define data shapes, for example, an object. Below are some of the features that one might have but not the other
* Interface:
    * declaration merging
    * extends & implements
* Type Alias
    * tuple
    * intersection
    * union
```typescript
/* No `declaration merging` in `type alias`
type a = {
    a: number;
}
type a = {
    b: number;
};
*/

// type a extends b; // error
interface ExtendProps extends MoreProps {
    props: string[];
};
const extendProps: ExtendProps = {
    // render: false, // optional
    props: [],
    moreState: '',
    state: 1,
    setState: (n) => console.log(n),
};
```

#### Anonymous
```typescript
type Input = (number | string)[];
// type Input = Data[]
const inputs: Input = ['0']; // no error
inputs.push(1); // no error
inputs.unshift('2'); // no error
// inputs.indexOf(true); // error

type Objects = { value: number }[]
const objects: Objects = [];
objects.push({ value: 0 }); // no error
// objects.push(0); // error
```

### Generics
```typescript
type SetState<T> = (newState: T) => void;
interface State<T> {
    state: T;
    setState: SetState<T>;
}
const setState = <T>(newState: T) => console.log(newState);
const useState: State<number> = {
    state: 0,
    setState: setState,
}
useState.setState(1); // no error
// useState.setState(''); // error

const stringsGeneric: Array<string> = ['1', '2'];
stringsGeneric[0] = ''; // no error
// stringsGeneric[1] = 1; // error
const stringsPrimitive: string[] = ['1', '2'];
stringsPrimitive[0] = ''; // no error
// stringsPrimitive[1] = 1; // error
```

### Class
```typescript
class LinkedList {
    private value: number;
    protected next: LinkedList | null;
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
linkedList.display(); // a b
```

TypeScript also supports a lot of the OOP concepts
* abstract class
* a class can extend another class
* a class can implement an interface
* an interface can extend another interface
* an interface can extend a class
> :o WHAT 😱

## Resources
[**The TypeScript Handbook**](https://www.typescriptlang.org/docs/handbook/intro.html)