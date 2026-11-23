import { connectDatabase } from '../../server/database.js'
import { Favourite } from '../../server/models.js'

export const config = { path: '/api/favourites' }

export default async (request) => {
    if (request.method !== 'GET') {
        return Response.json({ error: 'Method not allowed' }, {
            status: 405,
            headers: { Allow: 'GET' }
        })
    }

    try {
        await connectDatabase()
        const items = await Favourite.find().sort({ pokemon_id: 1 }).select('-_id').lean()
        return Response.json(items)
    } catch (error) {
        console.error('GET /api/favourites failed:', error.name)
        return Response.json({ error: 'Failed to fetch items' }, { status: 500 })
    }
}
