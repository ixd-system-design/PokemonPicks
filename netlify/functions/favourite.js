import { connectDatabase } from '../../server/database.js'
import { Favourite } from '../../server/models.js'

export const config = { path: '/api/favourite' }

// GET looks up a favourite by its PokeAPI name. POST adds or removes it.
export default async (request) => {
    if (request.method === 'GET') {
        const name = new URL(request.url).searchParams.get('name')

        try {
            await connectDatabase()
            const item = await Favourite.findOne({ name }).select('name url -_id').lean()
            return Response.json({ exists: Boolean(item), item })
        } catch (error) {
            console.error('GET /api/favourite failed:', error.name)
            return Response.json({ error: 'Failed to fetch item' }, { status: 500 })
        }
    }

    if (request.method === 'POST') {
        try {
            const { name, url } = (await request.json()) ?? {}
            if (typeof name !== 'string' || !name) {
                return Response.json({ error: 'Provide a Pokémon name.' }, { status: 400 })
            }

            await connectDatabase()
            // Wait for the unique name index before accepting writes.
            await Favourite.init()

            // If another request saves this Pokémon first, retry the toggle.
            while (true) {
                const { deletedCount } = await Favourite.deleteOne({ name })
                if (deletedCount > 0) {
                    return Response.json({ action: 'removed' })
                }

                try {
                    const item = { name, url }
                    await Favourite.create(item)
                    return Response.json({ action: 'added', item }, { status: 201 })
                } catch (error) {
                    if (error.code !== 11000 || !error.keyPattern?.name) throw error
                }
            }
        } catch (error) {
            console.error('POST /api/favourite failed:', error.name)
            return Response.json({ error: 'Failed to toggle item' }, { status: 500 })
        }
    }

    return Response.json({ error: 'Method not allowed' }, {
        status: 405,
        headers: { Allow: 'GET, POST' }
    })
}
