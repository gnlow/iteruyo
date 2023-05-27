// deno-lint-ignore-file no-this-alias

type IterableLike<I> = Iterable<I> | (() => Iterator<I>)

const iterably = <I>(iterable: IterableLike<I>) => {
    if (typeof iterable == "function") {
        return {
            [Symbol.iterator]: iterable
        }
    } else {
        return iterable
    }
}

export default class Iteruyo<I> {
    iterable
    constructor(iterableLike: IterableLike<I>) {
        this.iterable = iterably(iterableLike)
    }

    [Symbol.iterator]() {
        return this.iterable[Symbol.iterator]()
    }

    static from<I>(iterable: IterableLike<I>) {
        return new Iteruyo(iterable)
    }

    map<O>(f: (i: I) => O) {
        const that = this
        return new Iteruyo(function*() {
            for (const i of that)
                yield f(i)
        })
    }

    flatMap<O>(f: (i: I) => IterableLike<O>) {
        const that = this
        return new Iteruyo(function*() {
            for (const i of that)
                for (const j of iterably(f(i)))
                    yield j
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

    mapDescriptor() {
        const that = this
        return new Iteruyo(function*() {
            const iterator = that[Symbol.iterator]()
            let item = iterator.next()
            while (!item.done) {
                yield {
                    value: item.value,
                    done: (item = iterator.next()).done,
                }
            }
        })
    }

    seperate(seperator: I) {
        return this
            .mapDescriptor()
            .flatMap(({ value, done }) => function*() {
                yield value
                if (!done)
                    yield seperator
            })
    }

    join(seperator: string) {
        return this
            .map(String)
            .seperate(seperator)
            .toString()
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

    toArray() {
        return [...this]
    }

    toString() {
        return this
            .toArray()
            .join("")
    }
}

Iteruyo
    .from([1, 2, 3])
    .pipe(x => console.log(x.join("")))