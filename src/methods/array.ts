import { IterableLike, iterably } from "../type.ts"

import { $ } from "../../mod.ts"

export const map =
    <I, O>
    (f: (i: I) => O) =>
    (iterable: Iterable<I>) =>
    $(function*() {
        for (const i of iterable)
            yield f(i)
    })

export const flatMap =
    <I, O>
    (f: (i: I) => IterableLike<O>) =>
    (iterable: Iterable<I>) =>
    $(function*() {
        for (const i of iterable)
            for (const j of iterably(f(i)))
                yield j
    })

export const forEach =
    <I>
    (f: (i: I) => void) =>
    (iterable: Iterable<I>) => {
        for (const i of iterable)
            f(i)
    }

export const filter =
    <I, T extends I>
    (f: (i: I) => i is T) =>
    (iterable: Iterable<I>) =>
    $(function*() {
        for (const i of iterable)
            if (f(i))
                yield i
    })

export const flat =
    <T>
    (iterable: Iterable<IterableLike<T>>) =>
    $(function*() {
        for (const i of iterable)
            yield* iterably(i)
    })

export const find =
    <I, T extends I>
    (f: (i: I) => i is T) =>
    (iterable: Iterable<I>) => {
        for (const i of iterable)
            if (f(i))
                return i
    }

export const reduce =
    <I, O>
    (f: (o: O, i: I) => O, initial: O) =>
    (iterable: Iterable<I>) => {
        let o = initial
        for (const i of iterable)
            o = f(o, i)
        return o
    }

export const every =
    <I>
    (f: (i: I) => boolean) =>
    (iterable: Iterable<I>) => {
        for (const i of iterable)
            if (!f(i))
                return false
        return true
    }

export const some =
    <I>
    (f: (i: I) => boolean) =>
    (iterable: Iterable<I>) => {
        for (const i of iterable)
            if (f(i))
                return true
        return false
    }

export const join =
    (seperator: string) =>
    (iterable: Iterable<unknown>) =>
    reduce((a, b) => a + (a ? seperator : "") + b, "")(iterable)

export const length =
    (iterable: Iterable<unknown>) => {
        let length = 0
        for (const _ of iterable)
            length++
        return length
    }