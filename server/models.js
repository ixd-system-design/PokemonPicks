import mongoose from 'mongoose'

// Use the canonical PokeAPI name to keep one favourite per Pokémon.
const favouriteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true
    }
}, { collection: 'favourite_pokemon', versionKey: false })

export const Favourite = mongoose.models.Favourite || mongoose.model('Favourite', favouriteSchema)
