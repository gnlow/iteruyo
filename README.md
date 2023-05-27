# iteruyo

```ts
import { $ } from "https://deno.land/x/iteruyo/mod.ts"

$([1, 2, 3, 4, 5])
    .filter(x => x % 2 === 0)
    .map(x => x * 2)
    .forEach(console.log) // 4 8
```
