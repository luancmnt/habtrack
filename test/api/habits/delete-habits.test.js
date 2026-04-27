const request = require("supertest")
const { expect } = require("chai")
require("dotenv").config()

const postHabit = require("../../infra/fixtures/postHabit.json")
const { authenticateUser } = require("../../infra/helpers/auth")
const { createHabit } = require("../../infra/helpers/habit")

describe("DELETE /api/habits/:id", () => {
    let token
    let secondToken
    let habitId
    let bodyHabit

    beforeEach(async () => {
        token = await authenticateUser(`luana.${Date.now()}@test.com`)
        secondToken = await authenticateUser(`luana.other.${Date.now()}@test.com`)
        bodyHabit = { ...postHabit }

        const createdHabitResponse = await createHabit(token, bodyHabit)
        habitId = createdHabitResponse.body.data.id
    })

    it("Should return 200 deleting a habit correctly", async () => {
        const response = await request(process.env.BASE_URL)
            .delete(`/api/habits/${habitId}`)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal("Habito removido com sucesso.")
    })

    it("Should return 404 when deleting a habit that does not exist", async () => {
        const response = await request(process.env.BASE_URL)
            .delete("/api/habits/999999")
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).to.equal(404)
        expect(response.body.message).to.equal("Habito nao encontrado para o usuario autenticado.")
    })

    it("Should return 404 when deleting another user's habit", async () => {
        const response = await request(process.env.BASE_URL)
            .delete(`/api/habits/${habitId}`)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${secondToken}`)

        expect(response.status).to.equal(404)
        expect(response.body.message).to.equal("Habito nao encontrado para o usuario autenticado.")
    })

    it("Should return 401 when deleting a habit without bearer token", async () => {
        const response = await request(process.env.BASE_URL)
            .delete(`/api/habits/${habitId}`)
            .set("Content-Type", "application/json")

        expect(response.status).to.equal(401)
        expect(response.body.message).to.equal("Token Bearer nao informado.")
    })

    it("Should return 401 when deleting a habit with an invalid token", async () => {
        const response = await request(process.env.BASE_URL)
            .delete(`/api/habits/${habitId}`)
            .set("Content-Type", "application/json")
            .set("Authorization", "Bearer token-invalido")

        expect(response.status).to.equal(401)
        expect(response.body.message).to.equal("Token invalido ou expirado.")
    })
})
