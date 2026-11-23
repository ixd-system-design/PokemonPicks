import { connectDatabase } from '../../server/database.js'
import { Favourite } from '../../server/models.js'

export const config = { path: '/api/favourite' }

// Use the PokeAPI name to look up, save, or remove a favourite.
export default async (request) => {
    const name = new URL(request.url).searchParams.get('name')
    await connectDatabase()

    if (request.method === 'GET') {
        try {
            const item = await Favourite.findOne({ name }).select('name url -_id').lean()
            return Response.json(item)
        } catch (error) {
            console.error('GET /api/favourite failed:', error.name)
            return Response.json({ error: 'Failed to fetch item' }, { status: 500 })
        }
    }

    if (request.method === 'PUT') {
        try {
            const { url } = (await request.json()) ?? {}
            const item = await Favourite.validate({ name, url })
            await Favourite.init() // Wait for the unique name index.
            const { upsertedCount } = await Favourite.updateOne({ name }, { $set: { url: item.url } }, { upsert: true })
            return Response.json(item, { status: upsertedCount ? 201 : 200 })
        } catch (error) {
            if (error instanceof SyntaxError) {
                return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
            }
            if (error.name === 'ValidationError') {
                return Response.json({ error: 'Provide a valid Pokémon name and PokeAPI detail URL.' }, { status: 400 })
            }
            console.error('PUT /api/favourite failed:', error.name)
            return Response.json({ error: 'Failed to save favourite' }, { status: 500 })
        }
    }

    if (request.method === 'DELETE') {  
        try {
            await Favourite.deleteOne({ name })
            return new Response(null, { status: 204 })
        } catch (error) {
            console.error('DELETE /api/favourite failed:', error.name)
            return Response.json({ error: 'Failed to remove favourite' }, { status: 500 })
        }
    }

    return Response.json({ error: 'Method not allowed' }, {
        status: 405,
        headers: { Allow: 'GET, PUT, DELETE' }
    })
}
