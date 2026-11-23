let favourites = []

// Refresh the list and keep the last loaded copy available if the request fails.
const getFavourites = async () => {
    try {
        const response = await fetch('/api/favourites')
        if (!response.ok) throw new Error(`Favourites request failed (${response.status})`)
        favourites = await response.json()
        return favourites
    } catch (err) {
        console.error('Failed to fetch collection:', err)
        return favourites
    }
}

// Save or remove a favourite, then update every visible copy of its heart.
const toggleFavorite = async ({ pokemonName, pokemonUrl }) => {
    const wasFavourite = isFavourite(pokemonName)
    const query = new URLSearchParams({ name: pokemonName })
    const hearts = document
        .querySelectorAll(`.favorite[data-pokemon-name="${pokemonName}"] .heart`)

    hearts.forEach(heart => heart.classList.add('loading'))

    try {
        const options = { method: wasFavourite ? 'DELETE' : 'PUT' }
        if (!wasFavourite) {
            options.headers = { 'Content-Type': 'application/json' }
            options.body = JSON.stringify({ url: pokemonUrl })
        }

        const response = await fetch(`/api/favourite?${query}`, options)
        if (!response.ok) throw new Error(`Favourites request failed (${response.status})`)

        if (wasFavourite) {
            favourites = favourites.filter(pokemon => pokemon.name !== pokemonName)
            document.querySelector(`section.favourites .listing-${pokemonName}`)?.remove()
        } else {
            const item = await response.json()
            if (!isFavourite(pokemonName)) favourites.push(item)
        }
        hearts.forEach(heart => {
            heart.src = wasFavourite ? 'heart-outline.svg' : 'heart-fill.svg'
        })
    } catch (err) {
        console.error('Failed to toggle favorite:', err)
    } finally {
        hearts.forEach(heart => heart.classList.remove('loading'))
    }
}

// Listings and profiles use the loaded collection to choose a heart icon.
const isFavourite = (pokemonName) => {
    return favourites.some(pokemon => pokemon.name === pokemonName)
}


export { toggleFavorite, getFavourites, isFavourite }
