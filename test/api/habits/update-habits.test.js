const request = require("supertest")
const { expect } = require("chai")
require("dotenv").config()

const postHabit = require("../../infra/fixtures/postHabit.json")
const putHabit = require("../../infra/fixtures/putHabit.json")
const { authenticateUser } = require("../../infra/helpers/auth")
const { createHabit } = require("../../infra/helpers/habit")

describe("PUT /api/habits/:id", () => {
    let token
    let secondToken
    let habitId
    let bodyHabit
    let bodyUpdateHabit

    beforeEach(async () => {
        token = await authenticateUser(`luana.${Date.now()}@test.com`)
        secondToken = await authenticateUser(`luana.other.${Date.now()}@test.com`)

        bodyHabit = { ...postHabit }
        bodyUpdateHabit = { ...putHabit }

        const createdHabitResponse = await createHabit(token, bodyHabit)
        habitId = createdHabitResponse.body.data.id
    })

    it("Should return 200 updating a habit correctly", async () => {
        const response = await request(process.env.BASE_URL)
            .put(`/api/habits/${habitId}`)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send(bodyUpdateHabit)

        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal("Habito atualizado com sucesso.")
        expect(response.body.data).to.include({
            id: habitId,
            name: bodyUpdateHabit.name,
            description: bodyUpdateHabit.description
        })
        expect(response.body.data.userId).to.be.a("number")
        expect(response.body.data.completedToday).to.equal(false)
        expect(response.body.data.statusToday).to.equal("pending")
        expect(response.body.data.createdAt).to.be.a("string")
        expect(response.body.data.updatedAt).to.be.a("string")
    })

    it("Should return 200 updating a habit with only name", async () => {
        delete bodyUpdateHabit.description

        const response = await request(process.env.BASE_URL)
            .put(`/api/habits/${habitId}`)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send(bodyUpdateHabit)

        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal("Habito atualizado com sucesso.")
        expect(response.body.data.name).to.equal(bodyUpdateHabit.name)
        expect(response.body.data.description).to.equal("")
    })

    it("Should return 400 when updating a habit without name", async () => {
        delete bodyUpdateHabit.name

        const response = await request(process.env.BASE_URL)
            .put(`/api/habits/${habitId}`)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send(bodyUpdateHabit)

        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal("name e obrigatorio.")
    })

    it("Should return 400 when updating a habit with an empty name", async () => {
        bodyUpdateHabit.name = "   "

        const response = await request(process.env.BASE_URL)
            .put(`/api/habits/${habitId}`)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send(bodyUpdateHabit)

        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal("name e obrigatorio.")
    })

    it("Should return 401 when updating a habit without bearer token", async () => {
        const response = await request(process.env.BASE_URL)
            .put(`/api/habits/${habitId}`)
            .set("Content-Type", "application/json")
            .send(bodyUpdateHabit)

        expect(response.status).to.equal(401)
        expect(response.body.message).to.equal("Token Bearer nao informado.")
    })

    it("Should return 401 when updating a habit with an invalid token", async () => {
        const response = await request(process.env.BASE_URL)
            .put(`/api/habits/${habitId}`)
            .set("Content-Type", "application/json")
            .set("Authorization", "Bearer token-invalido")
            .send(bodyUpdateHabit)

        expect(response.status).to.equal(401)
        expect(response.body.message).to.equal("Token invalido ou expirado.")
    })

    it("Should return 404 when updating a habit that does not exist", async () => {
        const response = await request(process.env.BASE_URL)
            .put("/api/habits/999999")
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send(bodyUpdateHabit)

        expect(response.status).to.equal(404)
        expect(response.body.message).to.equal("Habito nao encontrado para o usuario autenticado.")
    })

    it("Should return 404 when updating another user's habit", async () => {
        const response = await request(process.env.BASE_URL)
            .put(`/api/habits/${habitId}`)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${secondToken}`)
            .send(bodyUpdateHabit)

        expect(response.status).to.equal(404)
        expect(response.body.message).to.equal("Habito nao encontrado para o usuario autenticado.")
    })
})
