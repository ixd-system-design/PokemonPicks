import { connectDatabase } from '../../server/database.js'
import { Favourite } from '../../server/models.js'

export const config = { path: '/api/favourites' }

// Return the shared collection in Pokémon name order for the Favourites tab.
export default async (request) => {
    if (request.method === 'GET') {
        try {
            await connectDatabase()
            const items = await Favourite.find().sort({ name: 1 }).select('name url -_id').lean()
            return Response.json(items)
        } catch (error) {
            console.error('GET /api/favourites failed:', error.name)
            return Response.json({ error: 'Failed to fetch items' }, { status: 500 })
        }
    }

    return Response.json({ error: 'Method not allowed' }, {
        status: 405,
        headers: { Allow: 'GET' }
    })
}
