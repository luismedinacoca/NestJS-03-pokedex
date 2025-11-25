# 🥇 Code 1: `insertMany()` --- Most Efficient

## Example Code (Seed Service using `insertMany`)

``` ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PokeResponse, Result } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed(): Promise<Result[]> {
    // 1. Fetch request
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
    if (!response.ok) {
      throw new Error(`Request error: ${response.status}`);
    }

    const data: PokeResponse = await response.json();

    // 2. Build batch data
    const pokemonToInsert = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      return { name, no };
    });

    // 3. Batch insert for maximum efficiency
    await this.pokemonModel.insertMany(pokemonToInsert);

    return data.results;
  }
}
```

## ✔️ Advantages of `insertMany()`

-   🚀 **Highest performance** --- Only one DB request.
-   ⚡ **Faster writes** --- MongoDB optimizes batch operations
    internally.
-   🧠 **Clean and concise code** --- One asynchronous call.
-   💾 **Lower memory and CPU usage** --- No multiple promises.

## ⚠️ Disadvantages

-   ❌ If one document fails, the whole batch may fail (unless
    configured).
-   🔧 Less fine-grained control over individual insert errors.
-   🛠️ Less flexible for per-document validation logic.

------------------------------------------------------------------------

# 🥈 Code 2: `Promise.all(create())` --- Flexible but Slower

## Example Code (Seed Service using `Promise.all + create()`)

``` ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse, Result } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed(): Promise<Result[]> {
    await this.pokemonModel.deleteMany({}); // Optional: reset DB

    // 1. Fetch request
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=15');
    if (!response.ok) {
      throw new Error(`Request error: ${response.status}`);
    }

    const data: PokeResponse = await response.json();

    // 2. Map each record into an async create operation
    const inserts: Promise<Pokemon>[] = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      return this.pokemonModel.create({ name, no }); // Promise<Pokemon>
    });

    // 3. Run all async operations concurrently
    await Promise.all(inserts);

    return data.results;
  }
}
```

## ✔️ Advantages of `Promise.all(create())`

-   🔍 **Individual control** over each inserted document.
-   🧱 If one insertion fails, others can still succeed.
-   🔒 Greater flexibility for per-document custom validation or logic.

## ❌ Disadvantages

-   🐌 **Slower** --- Each `create()` is a separate DB request.
-   💥 Higher CPU and connection overhead (many promises).
-   💻 More verbose and less clean for simple batch operations.

------------------------------------------------------------------------

# 🏁 Final Conclusion

> **`insertMany()` is the best choice for performance and simplicity;
> `Promise.all(create())` is useful only when you need fine-grained
> control per document.**

------------------------------------------------------------------------

# 📌 One-Sentence Summary

> **Use `insertMany()` for speed, use `Promise.all(create())` for
> control.**

------------------------------------------------------------------------


# 🥉 Code 3: `Axios` + `forEach` --- ⚠️ The "Naive" Approach

## Example Code (Seed Service using Axios + forEach)

```ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({}); // Optional: reset DB

    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

    // ⚠️ WARNING: This is NOT recommended!
    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      await this.pokemonModel.create({ name, no });
    });

    return data.results;
  }
}
```

## ✔️ Advantages of Axios

-   🛠️ **Automatic JSON transformation** --- No need to manually call `.json()`.
-   🛡️ **Better error handling** --- Axios throws errors for non-2xx responses automatically.
-   ✨ **Clean syntax** --- Easy to read and write.

## ❌ Disadvantages (forEach Loop)

-   ⚠️ **CRITICAL: `forEach` is not async-aware** --- The loop will **NOT** wait for the `create()` operations to finish. The function returns immediately, leading to potential race conditions or incomplete data.
-   🐌 **Slow Performance** --- Like `Promise.all`, it performs individual inserts, but without the concurrency control.
-   📉 **Resource Heavy** --- Opens many separate DB operations.