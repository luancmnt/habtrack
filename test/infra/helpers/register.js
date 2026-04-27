const request = require("supertest")
require("dotenv").config()

async function registerUser(email = `luana.${Date.now()}@test.com`, password = "123456", name = "Luana") {
    const response = await request(process.env.BASE_URL)
        .post("/api/auth/register")
        .set("Content-Type", "application/json")
        .send({ name, email, password })

    return response
}

module.exports = { registerUser }
