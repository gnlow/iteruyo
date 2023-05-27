import { assertEquals } from "https://deno.land/std@0.189.0/testing/asserts.ts"

import Iteruyo from "../mod.ts"

Deno.test("map", () => {
    assertEquals(
        Iteruyo
            .from([1, 2, 3, 4, 5])
            .map(i => i * 2)
            .toArray(),
        [1, 2, 3, 4, 5]
            .map(i => i * 2)
    )
})

Deno.test("flatMap", () => {
    assertEquals(
        Iteruyo
            .from([1, 2, 3])
            .flatMap(i => [i, i])
            .toArray(),
        [1, 2, 3]
            .flatMap(i => [i, i])
    )
})