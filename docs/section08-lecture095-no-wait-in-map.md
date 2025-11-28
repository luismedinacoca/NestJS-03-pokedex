# The Key is What `.map()` Expects

Let's look at the line:

```typescript
return this.pokemonModel.create({ name, no });
```

## 🧠 What does `pokemonModel.create()` return?

`this.pokemonModel.create(...)` returns a `Promise<Pokemon>`.
It does not return the created Pokémon immediately, but a promise that will resolve when MongoDB finishes saving it.

## 📌 Why is there no `await`?

We are collecting promises, not results.

```typescript
const inserts: Promise<Pokemon>[] = data.results.map(({ name, url }) => {
  // this.pokemonModel.create() returns a Promise<Pokemon>
  return this.pokemonModel.create({ name, no }); // ← No await
});
```

`Promise.all()` needs an array of promises:

```typescript
await Promise.all(inserts); // ← ALL promises are awaited here
```

## ❓ What would happen if you used `await`?

```typescript
// ❌ INCORRECT - sequential execution
const inserts = data.results.map(async ({ name, url }) => {
  const segments = url.split('/');
  const no: number = +segments[segments.length - 2];
  return await this.pokemonModel.create({ name, no }); // With await
});
```

In this case:
*   They would execute one by one (15 sequential operations).
*   You would lose concurrency.
*   It would be slower.

## 🔄 Correct vs Incorrect Flow

### ✅ CORRECT (Concurrent)

```typescript
// 1. Create all promises (they start immediately)
const inserts = data.results.map(item => this.pokemonModel.create(...));

// 2. Wait for ALL to finish
await Promise.all(inserts); // ← Concurrent execution
```

**Total time:** ~time_of_the_slowest_one

### ❌ INCORRECT (Sequential)

```typescript
const results = [];
for (const item of data.results) {
  results.push(await this.pokemonModel.create(...)); // ← One by one
}
```

**Total time:** ~sum_of_all_times

## 👀 Summary

*   **Without `await`:** You create promises that execute concurrently.
*   **With `await`:** You wait for each one sequentially, losing efficiency.

The pattern used is a common technique for executing asynchronous operations in parallel. It is much more efficient when operations are independent, as in this case of inserting multiple Pokémon.
