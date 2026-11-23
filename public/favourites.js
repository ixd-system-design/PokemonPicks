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

// Ask the server to toggle a favourite, then update every visible copy of its heart.
const toggleFavorite = async ({ pokemonName, pokemonUrl }) => {
    const hearts = document
        .querySelectorAll(`.favorite[data-pokemon-name="${pokemonName}"] .heart`)

    hearts.forEach(heart => heart.classList.add('loading'))

    try {
        const response = await fetch('/api/favourite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: pokemonName,
                url: pokemonUrl
            })
        })
        if (!response.ok) throw new Error(`Favourites request failed (${response.status})`)
        const result = await response.json()

        if (result.action === 'added') {
            favourites.push(result.item)
        } else {
            favourites = favourites.filter(pokemon => pokemon.name !== pokemonName)
            document.querySelector(`section.favourites .listing-${pokemonName}`)?.remove()
        }
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

// Listings and profiles use the loaded collection to choose a heart icon.
const isFavourite = (pokemonName) => {
    return favourites.some(pokemon => pokemon.name === pokemonName)
}


export { toggleFavorite, getFavourites, isFavourite }
