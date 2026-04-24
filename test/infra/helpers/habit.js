const request = require("supertest")
require("dotenv").config()

async function createHabit(token, body) {
    const response = await request(process.env.BASE_URL)
        .post("/api/habits")
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(body)

    return response
}

module.exports = { createHabit }
