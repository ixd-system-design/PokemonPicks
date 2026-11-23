# Favourite Pokemon

Browse Pokémon from PokeAPI and add or remove them from a shared favourites collection. Netlify serves the frontend in `public/` and routes favourites requests to `netlify/functions/`. The Mongoose model and MongoDB connection live in `server/`. [PokeAPI](https://pokeapi.co)

## Run locally

1. Use Node.js 24 and run `npm install`.
2. Copy `.env.example` to `.env`. Set `MONGODB_URI` to a connection string with your database name.
3. Run `npm run dev` (or `npm start`) and open the local URL printed by Netlify Dev. [Netlify Dev docs](https://docs.netlify.com/api-and-cli-guides/cli-guides/local-development/)

## Deploy to Netlify

Import this repository into Netlify. The included `netlify.toml` sets the publish directory, functions directory, and Node.js version. Set `MONGODB_URI` in the site's environment variables with the Functions scope, then deploy. [Netlify function environment variables](https://docs.netlify.com/build/functions/environment-variables/)

Mongoose stores favourites in the `favourites` collection. Each document has an automatically generated MongoDB `_id` and a unique numeric `pokemon_id` from PokeAPI. The app also accepts `DATABASE_URL` when `MONGODB_URI` is unset.

## Favourites API

| Method and path | Result |
| --- | --- |
| `GET /api/favourites` | Lists favourites as `{ pokemon_id, pokemon_name, pokemon_url }` items, sorted by Pokémon ID. |
| `POST /api/favourite` | Toggles a favourite using `{ pokemon_name, pokemon_url }`. Returns `{ action, item }` with status 201 for an add or 200 for a removal. |
| `GET /api/favourite?id=25` | Looks up a favourite by PokeAPI ID. Returns `{ exists, item }` with `item: null` when the Pokémon is absent. |
