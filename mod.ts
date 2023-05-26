// deno-lint-ignore-file no-this-alias

type IterableLike<I> = Iterable<I> | (() => Iterator<I>)

class Iteruyo<I> {
    iterable
    constructor(iterable: IterableLike<I>) {
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

    static from(iterable: IterableLike<I>) {
        return new Iteruyo(iterable)
    }

    map<O>(f: (i: I) => O) {
        const that = this
        return new Iteruyo(function*() {
            for (const i of that)
                yield f(i)
        })
    }

    filter(f: (i: I) => boolean) {
        const that = this
        return new Iteruyo(function*() {
            for (const i of that)
                if (f(i))
                    yield i
        })
    }

    length() {
        let length = 0
        for (const _ of this)
            length++
        return length
    }

    pipe<A>(f: (i: Iteruyo<I>) => A) {
        return f(this)
    }
}

Iteruyo
    .from([1, 2, 3])
    .map(i => i * 2)
    .pipe(x => console.log(...x))