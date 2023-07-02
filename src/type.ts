export type IterableLike<I> = Iterable<I> | (() => Iterator<I>)

export const iterably = <I>(iterable: IterableLike<I>) => {
    if (typeof iterable == "function") {
        return {
            [Symbol.iterator]: iterable
        }
    } else {
        return iterable
    }
}