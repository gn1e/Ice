const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        created: { type: Date, required: true },
        isbanned: { type: Boolean, default: false },
        ip: { type: String, required: true, unique: true },
        accountId: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        username_lower: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    },
    {
        collection: "users"
    }
)

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;