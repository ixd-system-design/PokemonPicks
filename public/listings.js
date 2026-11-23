import { createProfile } from './profile.js';
import { isFavourite } from './favourites.js';

// Build a Pokémon card with a favourite button and a profile popover.
const createListing = (pokemon, sectionName) => {
  console.log(pokemon)
  // The numeric segment of the PokeAPI URL also identifies the sprite.
  const id = pokemon.url.split('/').filter(e => Number(e)).pop()
  // Skip alternate forms with IDs above 10000 because their sprites are often missing.
  if (id > 10000) return null
  const iconURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  // Include the section name because a Pokémon can appear in multiple sections.
  const popoverId = `${sectionName}-${pokemon.name}`
  const heartIcon = isFavourite(pokemon.name) ?
    'heart-fill.svg' : 'heart-outline.svg'
  const div = document.createElement('div')
  div.classList.add('listing')
  div.classList.add(`listing-${pokemon.name}`)
  let template =
    `<div class="listing-buttons">
      <button class="openButton" popoverTarget="${popoverId}" >
        <img src="${iconURL}" onError="this.src='pokeball.svg'"/>
        <span>${pokemon.name}</span>
        <img class="open" src="open.svg" />
      </button>
      <button class="favorite" data-pokemon-name="${pokemon.name}" data-pokemon-url="${pokemon.url}">
        <img src="${heartIcon}" class="heart" />
      </button>
    </div>
    <div popover id="${popoverId}">
      <div class="profile">
        <p>Loading...</p>
      </div>
    </div>`
  div.innerHTML = DOMPurify.sanitize(template)

  // Fetch the full profile only when someone opens the popover.
  div.querySelector(`#${popoverId}`)
    .addEventListener('toggle', async (event) => {
      if (event.newState == 'open') {
        let popover = event.target
        let template = await createProfile(popoverId, pokemon.url, pokemon.name)
        popover.innerHTML = template
      }
    })

  return div
}


// Render the Pokémon in a type or favourites section.
const createListings = (sectionName, pokemonList) => {
  let section = document.querySelector(`section.${sectionName}`)
  if (!section) {
    section = document.createElement('section')
    section.classList.add(sectionName)
    document.querySelector('main').appendChild(section)
  }
  section.innerHTML = ''

  pokemonList.forEach(pokemon => {
    const div = createListing(pokemon, sectionName)
    if (div) {
      section.appendChild(div)
    }
  })

}


export { createListings, createListing }

