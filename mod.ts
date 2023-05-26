// deno-lint-ignore-file no-this-alias
class Iteruyo<I> {
    iterable
    constructor(iterable: Iterable<I> | (() => Iterator<I>)) {
        if (typeof iterable == "function") {
            this.iterable = {
                [Symbol.iterator]: iterable
            }
        } else {
            this.iterable = iterable
        }
    }

    [Symbol.iterator]() {
        return this.iterable[Symbol.iterator]()
    }

    map<O>(f: (i: I) => O) {
        const that = this
        return new Iteruyo(function*() {
            for (const i of that)
                yield f(i)
        })
    }
}

const a = new Iteruyo([1, 2, 3])
const b = a.map(x => x * 2)

console.log(...b)
console.log(...a)
console.log(...b)
console.log(...a)