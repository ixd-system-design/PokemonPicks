# Favourite Pokemon

Browse Pokémon from PokeAPI and add or remove them from a shared favourites collection. Netlify serves the frontend in `public/` and routes favourites requests to `netlify/functions/`. The Mongoose model and MongoDB connection live in `server/`. [PokeAPI](https://pokeapi.co)

## Run locally

1. Use Node.js 24 and run `npm install`.
2. Copy `.env.example` to `.env`. Set `MONGODB_URI` to a connection string with your database name.
3. Run `npm run dev` (or `npm start`) and open the local URL printed by Netlify Dev. [Netlify Dev docs](https://docs.netlify.com/api-and-cli-guides/cli-guides/local-development/)

## Deploy to Netlify

Import this repository into Netlify. The included `netlify.toml` sets the publish directory, functions directory, and Node.js version. Set `MONGODB_URI` in the site's environment variables with the Functions scope, then deploy. [Netlify function environment variables](https://docs.netlify.com/build/functions/environment-variables/)

Mongoose stores favourites in the `favourite_pokemon` collection with a generated MongoDB `_id`, a unique canonical PokeAPI `name`, and a detail `url` for listings and profiles. The app also accepts `DATABASE_URL` when `MONGODB_URI` is unset.

## Follow a favourite click

1. Click Pikachu's heart. `public/main.js` passes the button's Pokémon name and URL to `public/favourites.js`.
2. If Pikachu is absent from the loaded favourites, the browser sends `PUT /api/favourite?name=pikachu` with its detail URL. If Pikachu is already saved, it sends `DELETE /api/favourite?name=pikachu`.
3. `netlify/functions/favourite.js` uses Mongoose to save or remove Pikachu by name. Once the request succeeds, `public/favourites.js` updates its list and every visible Pikachu heart.

## Favourites API

| Method and path | Result |
| --- | --- |
| `GET /api/favourites` | Lists favourites as `{ name, url }` items, sorted by Pokémon name. |
| `GET /api/favourite?name=pikachu` | Looks up a favourite by PokeAPI name. Returns `{ name, url }` or `null` if it is absent. |
| `PUT /api/favourite?name=pikachu` | Saves a favourite with a JSON body containing `url`. Returns `{ name, url }` with status 201 on creation or 200 on update. |
| `DELETE /api/favourite?name=pikachu` | Removes the favourite if present and returns 204 with an empty body. |
