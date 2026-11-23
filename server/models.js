import mongoose from 'mongoose'

const favouriteSchema = new mongoose.Schema({
    pokemon_id: { type: Number, required: true, unique: true, min: 1, validate: Number.isSafeInteger },
    pokemon_name: { type: String, required: true },
    pokemon_url: { type: String, required: true }
}, { collection: 'favourites', versionKey: false })

export const Favourite = mongoose.models.Favourite || mongoose.model('Favourite', favouriteSchema)
