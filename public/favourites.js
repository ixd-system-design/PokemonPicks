let favourites = {
    name: 'favourites',
    pokemon: []
}

// Fetch the latest favourites from the API
const getFavourites = async () => {
    try {
        const response = await fetch('/api/favourites')
        if (!response.ok) throw new Error(`Favourites request failed (${response.status})`)
        const items = await response.json()
        favourites = {
            name: 'favourites',
            pokemon: items.map(({ pokemon_name, pokemon_url }) => ({
                pokemon: { name: pokemon_name, url: pokemon_url }
            }))
        }
        return favourites
    } catch (err) {
        console.error('Failed to fetch collection:', err)
        return favourites
    }
}

// Shared toggle functionality for adding/removing Pokemon from collection
const toggleFavorite = async (pokemonName, pokemonUrl) => {
    const hearts = document
        .querySelectorAll(`.favorite[data-pokemon-name="${pokemonName}"] .heart`)

    hearts.forEach(heart => heart.classList.add('loading'))

    try {
        // Send pokemon data (just name and url)
        const response = await fetch('/api/favourite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pokemon_name: pokemonName,
                pokemon_url: pokemonUrl
            })
        })
        if (!response.ok) throw new Error(`Favourites request failed (${response.status})`)
        const result = await response.json()

        // Update favourites state based on action
        if (result.action === 'added') {
            favourites.pokemon.push({ pokemon: { name: pokemonName, url: pokemonUrl } })
        } else {
            favourites.pokemon = favourites.pokemon.filter(
                item => item.pokemon.name !== pokemonName
            )
            // remove from favourites section
            document.querySelector(`section.favourites .listing-${pokemonName}`)?.remove()
        }
        // Update UI based on action  for all hearts 
        hearts.forEach(heart => {
            heart.src = result.action === 'added' ? 'heart-fill.svg' : 'heart-outline.svg'
        })

        return result
    } catch (err) {
        console.error('Failed to toggle favorite:', err)
    } finally {
        hearts.forEach(heart => heart.classList.remove('loading'))
    }
}

const isFavourite = (pokemonName) => {
    return favourites.pokemon.some(item => item.pokemon.name === pokemonName)
}


export { toggleFavorite, getFavourites, isFavourite, favourites }
