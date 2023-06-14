# DDD Playlist Manager POC

## My objectives with this POC

- Explore alternatives on how to deal with huge collections of items following DDD patterns
- Before, I'd only be able to solve this problem by leaking some business logic to the database repository
- I want to see if I can incorporate the new knowledge from the software essentialist course into this problem

## New information

- **aggregate**: is everything that we can reasonably expect to change idempotently and atomically (all or nothing) in a single transaction.
- **Aggregates are not a domain modelling tool. They're an Application, transactional consistency boundary tool.**
- we can create an aggregate to our specific purpose of reordering the playlist. (eg. PlaylistReordering)
- do not force a models into fitting the application level limitations -> design a better aggregate for it.
- Entities = nouns.
- aggregate = a cluster of entities, value objects that change at the same time

## simple-typescript-starter info

source: https://github.com/stemmlerjs/simple-typescript-starter

### Features

- Minimal
- TypeScript v4
- Testing with Jest
- Linting with Eslint and Prettier
- Pre-commit hooks with Husky
- VS Code debugger scripts
- Local development with Nodemon

### Scripts

#### `npm run start:dev`

Starts the application in development using `nodemon` and `ts-node` to do hot reloading.

#### `npm run start`

Starts the app in production by first building the project with `npm run build`, and then executing the compiled JavaScript at `build/index.js`.

#### `npm run build`

Builds the app at `build`, cleaning the folder first.

#### `npm run test`

Runs the `jest` tests once.

#### `npm run test:dev`

Run the `jest` tests in watch mode, waiting for file changes.

#### `npm run prettier-format`

Format your code.

#### `npm run prettier-watch`

Format your code in watch mode, waiting for file changes.
