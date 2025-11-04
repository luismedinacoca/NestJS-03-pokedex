<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

 
# Section 07 - MongoDB - Pokedex

## Lecture 069: Starting Pokedex project

```bash
nest new 03-pokedex
```


### Set the project:
1. Delete **`app.controller.ts`** file
2. Delete **`app.service.ts`** file
3. Update **`ap.module.ts`** file:
    ```ts
    import { Module } from '@nestjs/common';
    @Module({
      imports: [],
      controllers: [],
      providers: [],
    })
    export class AppModule {}
    ```


## Lecture 070: Provide static content

### 1.Add the following files:
```
03-pokedex/
├── dist/
├── node_modules/
├── public/                // 👈🏽 ✅
│   ├── css/               // 👈🏽 ✅
│   │   └── styless.css    // 👈🏽 ✅
│   └── index.html                  
├── src/                     
│   ├── app.module.ts
│   └── main.ts 
├── test/                     
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .gitignore        
├── .prettierrc  
├── eslint.config.mjs      
├── nest-cli.json  
├── package-lock.json       
├── package.json
├── README.md
├── tsconfig.build.json      
└── tsconfig.json                       
```

### 2. Install **`@nestjs/serve-static`** dependency:
```bash
npm i @nestjs/serve-static
```

### 3. Add the following code in **`app.module.ts`**:
```ts
// ./src/app.module.ts
import { join } from 'path';    // 👈🏽 ✅
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';   // 👈🏽 ✅
@Module({
  imports: [
    ServeStaticModule.forRoot({   // 👈🏽 ✅
      rootPath: join(__dirname, '..', 'public'),    // 👈🏽 ✅
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

Go to any browser and enter to **`http://localhost:3000/`**



## Lecture 0
## Lecture 0