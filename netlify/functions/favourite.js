import { connectDatabase } from '../../server/database.js'
import { Favourite } from '../../server/models.js'

export const config = { path: '/api/favourite' }

export default async (request) => {
    if (request.method === 'POST') return toggleFavourite(request)

    if (request.method !== 'GET') {
        return Response.json({ error: 'Method not allowed' }, {
            status: 405,
            headers: { Allow: 'GET, POST' }
        })
    }

    const id = new URL(request.url).searchParams.get('id')
    const pokemon_id = Number(id)
    if (!/^[1-9][0-9]*$/.test(id) || !Number.isSafeInteger(pokemon_id)) {
        return Response.json({ error: 'Provide a valid Pokémon ID.' }, { status: 400 })
    }

    try {
        await connectDatabase()
        const item = await Favourite.findOne({ pokemon_id }).select('-_id').lean()
        return Response.json({ exists: Boolean(item), item })
    } catch (error) {
        console.error('GET /api/favourite failed:', error.name)
        return Response.json({ error: 'Failed to fetch item' }, { status: 500 })
    }
}

async function toggleFavourite(request) {
    let body
    try {
        body = await request.json()
    } catch {
        return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
    }

    const { pokemon_name, pokemon_url } = body ?? {}
    if (
        typeof pokemon_name !== 'string' ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pokemon_name) ||
        typeof pokemon_url !== 'string'
    ) {
        return Response.json({ error: 'Invalid Pokémon data. Provide a Pokémon name and URL.' }, { status: 400 })
    }

    const match = /^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/([1-9][0-9]*)\/?$/.exec(pokemon_url)
    const pokemon_id = Number(match?.[1])
    if (!Number.isSafeInteger(pokemon_id)) {
        return Response.json({ error: 'Provide a PokeAPI Pokémon URL with a numeric ID.' }, { status: 400 })
    }

    const item = { pokemon_id, pokemon_name, pokemon_url }
    try {
        await connectDatabase()
        await Favourite.init()

        // If another request inserts this ID first, retry the toggle against that document.
        while (true) {
            const removed = await Favourite.findOneAndDelete({ pokemon_id }).select('-_id').lean()
            if (removed) {
                return Response.json({ action: 'removed', item: removed })
            }

            try {
                await Favourite.create(item)
                return Response.json({ action: 'added', item }, { status: 201 })
            } catch (error) {
                if (error.code !== 11000 || !error.keyPattern?.pokemon_id) throw error
            }
        }
    } catch (error) {
        console.error('POST /api/favourite failed:', error.name)
        return Response.json({ error: 'Failed to toggle item' }, { status: 500 })
    }
}
