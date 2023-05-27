import { assertEquals } from "https://deno.land/std@0.189.0/testing/asserts.ts"

import {$} from "../mod.ts"

Deno.test("map", () => {
    assertEquals(
        $([1, 2, 3, 4, 5])
            .map(i => i * 2)
            .toArray(),
        [1, 2, 3, 4, 5]
            .map(i => i * 2)
    )
})

Deno.test("flatMap", () => {
    assertEquals(
        $([1, 2, 3])
            .flatMap(i => [i, i])
            .toArray(),
        [1, 2, 3]
            .flatMap(i => [i, i])
    )
})

Deno.test("filter", () => {
    assertEquals(
        $([1, 2, 3, 4, 5])
            .filter(i => i % 2 === 0)
            .toArray(),
        [1, 2, 3, 4, 5]
            .filter(i => i % 2 === 0)
    )
})

Deno.test("mapDescriptor", () => {
    assertEquals(
        $([1, 2, 3])
            .mapDescriptor()
            .toArray(),
        [
            { value: 1, done: false },
            { value: 2, done: false },
            { value: 3, done: true },
        ]
    )
})

Deno.test("seperate", () => {
    assertEquals(
        $([1, 2, 3])
            .seperate(0)
            .toArray(),
        [1, 0, 2, 0, 3]
    )
})

Deno.test("join", () => {
    assertEquals(
        $([1, 2, 3])
            .join("0"),
        [1, 2, 3]
            .join("0")
    )
})

Deno.test("length", () => {
    assertEquals(
        $([1, 2, 3])
            .length,
        [1, 2, 3]
            .length
    )
})

Deno.test("toArray", () => {
    assertEquals(
        $([1, 2, 3])
            .toArray(),
        [1, 2, 3]
    )
})
