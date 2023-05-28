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
            .filter(i => i % 2 == 0)
            .toArray(),
        [1, 2, 3, 4, 5]
            .filter(i => i % 2 == 0)
    )
})

Deno.test("flat", () => {
    assertEquals(
        $([[1, 2], [3, 4], [5, 6]])
            .flat()
            .toArray(),
        [[1, 2], [3, 4], [5, 6]]
            .flat()
    )
})

Deno.test("find", () => {
    assertEquals(
        $([1, 2, 3, 4, 5])
            .find(i => i % 2 == 0),
        [1, 2, 3, 4, 5]
            .find(i => i % 2 == 0)
    )
})

Deno.test("reduce", () => {
    assertEquals(
        $([1, 2, 3, 4, 5])
            .reduce((o, i) => o + i, 0),
        [1, 2, 3, 4, 5]
            .reduce((o, i) => o + i, 0)
    )
})

Deno.test("every", () => {
    assertEquals(
        $([1, 2, 3, 4, 5])
            .every(i => i % 2 == 0),
        [1, 2, 3, 4, 5]
            .every(i => i % 2 == 0)
    )
    assertEquals(
        $([1, 2, 3, 4, 5])
            .every(i => i > 0),
        [1, 2, 3, 4, 5]
            .every(i => i > 0)
    )
})

Deno.test("some", () => {
    assertEquals(
        $([1, 2, 3, 4, 5])
            .some(i => i % 2 == 0),
        [1, 2, 3, 4, 5]
            .some(i => i % 2 == 0)
    )
    assertEquals(
        $([1, 2, 3, 4, 5])
            .some(i => i > 4),
        [1, 2, 3, 4, 5]
            .some(i => i > 4)
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


Deno.test("split", () => {
    assertEquals(
        $("abc,d,ef")
            .split(",")
            .map(i => i.join(""))
            .toArray(),
        "abc,d,ef"
            .split(",")
    )
    assertEquals(
        $("abc->d->ef")
            .split("->")
            .map(i => i.join(""))
            .toArray(),
        "abc->d->ef"
            .split("->")
    )
    assertEquals(
        $("a->bc->->d-->->e")
            .split("->->")
            .map(i => i.join(""))
            .toArray(),
        "a->bc->->d-->->e"
            .split("->->")
    )
})

Deno.test("startsWith", () => {
    assertEquals(
        $([1, 2, 3])
            .startsWith([1, 2, 3]),
        true
    )
    assertEquals(
        $([1, 2, 3, 4])
            .startsWith([1, 2, 3]),
        true
    )
    assertEquals(
        $([1, 2, 3])
            .startsWith([1, 2, 3, 4]),
        false
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

Deno.test("enumerate", () => {
    assertEquals(
        $([1, 2, 3])
            .enumerate()
            .toArray(),
        [
            [0, 1],
            [1, 2],
            [2, 3],
        ]
    )
})

Deno.test("equal", () => {
    assertEquals(
        $([1, 2, 3])
            .equal([1, 2, 3]),
        true
    )
    assertEquals(
        $([1, 2, 3, 4])
            .equal([1, 2, 3]),
        false
    )
    assertEquals(
        $([1, 2, 3])
            .equal([1, 2, 3, 4]),
        false
    )
})

Deno.test("reduceWithGenerator", () => {
    assertEquals(
        $("abc def")
        .reduceWithGenerator(
            function*(o, i) {
                if (/^\w*$/.test(o))
                    if (/\w/.test(i))
                        return o + i
                    else {
                        yield o
                        return ""
                    }
                return o
            },
            "",
            "",
        )
        .toArray(),
        ["abc", "def"]
    )
})

Deno.test("toArray", () => {
    assertEquals(
        $([1, 2, 3])
            .toArray(),
        [1, 2, 3]
    )
})
