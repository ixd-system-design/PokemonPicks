import { createNavigation } from './navigation.js';
import { createListings } from './listings.js';
import { getFavourites, toggleFavorite } from './favourites.js';

// One click handler covers favourite buttons added later by the renderer.
document.addEventListener('click', (e) => {
  const favoriteBtn = e.target.closest('.favorite')
  if (favoriteBtn) {
    toggleFavorite(favoriteBtn.dataset)
  }
})

// Load favourites before rendering so the heart icons start in the right state.
await getFavourites()

// PokeAPI's type index gives us the URL for each type's details.
const response = await fetch('https://pokeapi.co/api/v2/type/?limit=100')
const { results } = await response.json()

// Fetch type details in parallel and unwrap each member for the listing renderer.
const pokemonTypes = await Promise.all(
  results.map(async (pokemonType) => {
    const data = await fetch(pokemonType.url)
    const { name, pokemon } = await data.json()
    return { name, pokemon: pokemon.map(entry => entry.pokemon) }
  })
)
const typesWithPokemon = pokemonTypes.filter(({ pokemon }) => pokemon.length > 0)
createNavigation(typesWithPokemon)
typesWithPokemon.forEach(({ name, pokemon }) => createListings(name, pokemon))



