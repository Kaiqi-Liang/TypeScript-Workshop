/* Type Inference */
const object = {
    state: true,
    setState: () => {},
};



/* JavaScript Primitives */
let num/*: number */= 42;
num = 0; // no error
// num = '0'; // error

let tf: boolean = true;
tf = false; // no error
// tf = 0; // error



/* The any type */
let n: any = 42;
n = '0'; // no error

/**
 * `const add: (a: any, b: any) => any`
 */
// const add = (a, b) => a + b;



/* Array */
// let numbers: number[] = ['0']; // error
let numbers: number[] = [];
numbers = [1, 2]; // no error
// numbers = [1, '2']; // error
// numbers.push('2'); // error



/* Function */
/**
 * Type Inference
 *
 * If you hover over `add` and `res` you'll see its type.
 * The return value of the function is `inferred`.
 */
const add = (a: number, b: number)/*: number */=> a + b;
const res/*: number */= add(1, 2); // no error
// add('1', 2); // error
// add(1); // error

/**
 * Older syntax
 */
function sub(a: number, b: number) {
    return a - b;
}



/* Interface */
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



/* Type Alias */
type Bool = boolean;
let bool: Bool = true; // no error
// bool = 0; // error

type setState = (newState: number) => void;



/* Tuple */
/**
 * This is what `React.useState` returns,
 * a `tuple`.
 */
type state = [number, setState];
// const useState: state = [1, 2]; // error

type Tuple = [number, string, boolean];
const tuple: Tuple = [1, '2', true]; // no error
// const tuple: Tuple = [1, '2']; // error



/* Intersection */
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
*/



/* Union */
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



/* Union & Intersection */
/**
 * The type `boolean` itself is actually just an `alias` for the `union`,
 * `true` | `false`.
 */
// const bool: boolean;
// type boolean = true | false;

type Bit = 0 | 1;
let bit: Bit = 1;
bit = 0;

type Hex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
type or = Bit | Hex;
type and = Bit & Hex;



/* Differences between Type Alias and Interface */
type Type = {
    name: string;
    method: () => {};
}

interface Interface {
    name: string;
    method: () => {};
}

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



/* Anonymous */
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



/* Generics */
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



/* Class */
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