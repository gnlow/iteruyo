import {$} from "./mod.ts"

const text =
`a:
    data + 2
    b: c -> d
        e: #
            f g i
            123.5
        foo
    hello
`

$("abc + def")
    .reduceWithGenerator(function*({state, value}, char) {
        console.log({state, value, char})
        if (state == "word") {
            if (/\w/.test(char)) {
                return {
                    state: "word",
                    value: value + char,
                }
            } else {
                yield { state, value }
            }
        } else if (state == "operator") {
            if (/[+\-*/]/.test(char)) {
                return {
                    state: "operator",
                    value: value + char,
                }
            } else {
                yield { state, value }
            }
        }

        if (/\w/.test(char)) {
            return {
                state: "word",
                value: char,
            }
        } else if (/\s/.test(char)) {
            return {
                state: "start",
                value: "",
            }
        } else if (/[+\-*/]/.test(char)) {
            return {
                state: "operator",
                value: char,
            }
        }

        throw `Unexpected char: "${char}"`
    },
    {
        state: "start",
        value: "",
    },
    " "
    )
    .pipe(x => console.log(x.toArray()))