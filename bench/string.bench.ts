import { $ } from "../mod.ts"

Deno.bench("Native", () => {
    "abc def ghi jkl mno pqr stu vwx yz".repeat(100)
        .split(" ")
        .flatMap(s => [s, s])
        .map(([head, ...tail]) => ({head, tail}))
        .length
})

Deno.bench("Iteruyo", () => {
    $("abc def ghi jkl mno pqr stu vwx yz".repeat(100))
        .split(" ")
        .flatMap(s => [s, s])
        .map(([head, ...tail]) => ({head, tail}))
        .length
})