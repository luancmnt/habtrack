const request = require("supertest")
require("dotenv").config()

async function authenticateUser(email = "test3@test.com", password = "123456", name = "Luana") {
    await request(process.env.BASE_URL)
        .post("/api/auth/register")
        .set("Content-Type", "application/json")
        .send({ name, email, password })

    const response = await request(process.env.BASE_URL)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send({ email, password })

    return response.body.data.token
}

module.exports = { authenticateUser }
