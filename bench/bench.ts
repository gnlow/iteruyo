import LazyIterator from "https://esm.sh/@sweet-monads/iterator@3.2.0"


const longArray = Array.from({ length: 1000000 }).map((_, i) => i + 1)

const lazyArray = LazyIterator.from<number>(longArray)

import { $ } from "../mod.ts"
const iteruyo = $(longArray)

import { $ as $2 } from "https://deno.land/x/iteruyo@v0.2.0/mod.ts"
const iteruyo2 = $2(longArray)

Deno.bench("Native", () => {
    const sum = longArray
        .filter(i => i % 2 != 0)
        .map(i => i * i)
        .map(i => i * i)
        .map(i => i * i)
        .filter(i => i % 3 != 0)
        .reduce((sum, i) => sum + i, 0)
    sum == 0
})

Deno.bench("@sweet-monads/iterator", () => {
    const sum = lazyArray
        .filter(i => i % 2 != 0)
        .map(i => i * i)
        .map(i => i * i)
        .map(i => i * i)
        .filter(i => i % 3 != 0)
        .sum()
    sum == 0
})

Deno.bench("Iteruyo", () => {
    const sum = iteruyo
        .filter(i => i % 2 != 0)
        .map(i => i * i)
        .map(i => i * i)
        .map(i => i * i)
        .filter(i => i % 3 != 0)
        .reduce((sum, i) => sum + i, 0)
    sum == 0
})

Deno.bench("Iteruyo@v0.2.0", () => {
    const sum = iteruyo2
        .filter(i => i % 2 != 0)
        .map(i => i * i)
        .map(i => i * i)
        .map(i => i * i)
        .filter(i => i % 3 != 0)
        .reduce((sum, i) => sum + i, 0)
    sum == 0
})