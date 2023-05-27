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

    /* Array */

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

    forEach(f: (i: I) => void) {
        for (const i of this)
            f(i)
    }

    filter(f: (i: I) => boolean): Iteruyo<I>
    filter<T extends I>(f: (i: I) => i is T): Iteruyo<T> {
        const that = this
        return new Iteruyo(function*() {
            for (const i of that)
                if (f(i))
                    yield i
        })
    }

    find(f: (i: I) => boolean): I | undefined
    find<T extends I>(f: (i: I) => i is T): T | undefined {
        for (const i of this)
            if (f(i))
                return i
    }

    reduce<O>(f: (o: O, i: I) => O, initial: O): O {
        let o = initial
        for (const i of this)
            o = f(o, i)
        return o
    }

    every(f: (i: I) => boolean): boolean {
        for (const i of this)
            if (!f(i))
                return false
        return true
    }

    some(f: (i: I) => boolean): boolean {
        for (const i of this)
            if (f(i))
                return true
        return false
    }

    join(seperator: string) {
        return this
            .map(String)
            .seperate(seperator)
            .toString()
    }

    get length() {
        let length = 0
        for (const _ of this)
            length++
        return length
    }

    /* String */

    
    split(seperator_: IterableLike<I>) {
        const seperator = [...iterably(seperator_)]
        const that = this
        return new Iteruyo(function*() {
            let candidates: number[] = []
            let buffer = []
            for (const item of that) {
                for (let i = 0; i < candidates.length; i++) {
                    const candy = candidates[i]
                    if (candy == seperator.length) {
                        yield buffer.slice(0, -candy)
                        buffer = []
                        candidates = []
                        break
                    }
                    if (item == seperator[candy]) {
                        candidates[i]++ // candy++
                    } else {
                        candidates.splice(i, 1)
                        i--
                    }
                }
                if (item == seperator[0]) {
                    candidates.push(1)
                }
                buffer.push(item)
            }
            yield buffer
        })
    }
    

    startsWith(iterable: IterableLike<I>) {
        const iterator = this[Symbol.iterator]()
        for (const i of iterably(iterable))
            if (iterator.next().value != i)
                return false
        return true
    }

    /* util */

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

    mapRest() {
        const that = this
        return new Iteruyo(function*() {
            const iterator = that[Symbol.iterator]()
            let item = iterator.next()
            while (!item.done) {
                yield item.value
                item = iterator.next()
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

    pipe<A>(f: (i: Iteruyo<I>) => A) {
        return f(this)
    }

    enumerate() {
        const that = this
        let index = 0
        return new Iteruyo(function*() {
            for (const i of that)
                yield [index++, i]
        })
    }

    equal(iterable: IterableLike<I>) {
        const iterator = iterably(iterable)[Symbol.iterator]()
        for (const i of this)
            if (iterator.next().value != i)
                return false
        return iterator.next().done
    }

    /* output */

    toArray() {
        return [...this]
    }

    toString() {
        return this
            .toArray()
            .join("")
    }
}

export const $ = Iteruyo.from