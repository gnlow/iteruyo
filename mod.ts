// deno-lint-ignore-file no-this-alias

import * as m from "./src/methods/mod.ts"

import { IterableLike, iterably } from "./src/type.ts"

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
        return m.map(f)(this)
    }

    flatMap<O>(f: (i: I) => IterableLike<O>) {
        return m.flatMap(f)(this)
    }

    forEach(f: (i: I) => void) {
        return m.forEach(f)(this)
    }

    filter(f: (i: I) => boolean): Iteruyo<I>
    filter<T extends I>(f: (i: I) => i is T) {
        return m.filter(f)(this)
    }

    flat<T>(this: Iteruyo<IterableLike<T>>) {
        return m.flat(this)
    }

    find(f: (i: I) => boolean): I | undefined
    find<T extends I>(f: (i: I) => i is T): T | undefined {
        return m.find(f)(this)
    }

    reduce<O>(f: (o: O, i: I) => O, initial: O): O {
        return m.reduce(f, initial)(this)
    }

    every(f: (i: I) => boolean): boolean {
        return m.every(f)(this)
    }

    some(f: (i: I) => boolean): boolean {
        return m.some(f)(this)
    }

    join(seperator: string) {
        return m.join(seperator)(this)
    }

    get length() {
        return m.length(this)
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

    reduceWithGenerator<Acc, O>(
        f: (acc: Acc, i: I) => Generator<O, Acc>,
        initial: Acc,
        final?: I,
    ) {
        const that = this
        return new Iteruyo<O>(function*() {
            let acc = initial
            for (const i of that) {
                acc = yield* f(acc, i)
            }
            if (typeof final != "undefined") {
                yield* f(acc, final)
            }
        })
    }

    bypass(f: (i: Iteruyo<I>) => void) {
        f(this)
        return this
    }

    take(n: number) {
        const that = this
        return new Iteruyo(function*() {
            for (const i of that) {
                if (n-- <= 0)
                    break
                yield i
            }
        })
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