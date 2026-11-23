import { getFavourites } from './favourites.js';
import { createListings } from './listings.js';


// Each button activates the section with the matching name.
const createNavItem = (name) => {
  const button = document.createElement('button')
  button.className = name
  button.textContent = name
  button.addEventListener('click', async () => {
    if (name === 'favourites') {
      // Other visitors can change the shared list, so refresh it when the tab opens.
      const favourites = await getFavourites()
      createListings(name, favourites)
    }
    document.querySelectorAll(`section`)
      .forEach(el => el.classList.remove('active'))
    document.querySelectorAll(`section.${name}`)
      .forEach(el => el.classList.add('active'))
  })
  document.querySelector('nav').appendChild(button)
}

// Add tabs for types that have Pokémon, followed by the Favourites tab.
const createNavigation = (pokemonTypes) => {
  pokemonTypes
    .filter(pokemonType => pokemonType.pokemon.length > 0)
    .forEach(pokemonType => createNavItem(pokemonType.name))

  createNavItem('favourites')
}

export { createNavigation }
