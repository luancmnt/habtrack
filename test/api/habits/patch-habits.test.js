const request = require("supertest")
const { expect } = require("chai")
require("dotenv").config()

const postHabit = require("../../infra/fixtures/postHabit.json")
const { authenticateUser } = require("../../infra/helpers/auth")
const { createHabit } = require("../../infra/helpers/habit")

describe("PATCH /api/habits/:id/today", () => {
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

    it("Should return 200 marking a habit as completed today", async () => {
        const response = await request(process.env.BASE_URL)
            .patch(`/api/habits/${habitId}/today`)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send({
                completed: true
            })

        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal("Status diario do habito atualizado com sucesso.")
        expect(response.body.data.id).to.equal(habitId)
        expect(response.body.data.completedToday).to.equal(true)
        expect(response.body.data.statusToday).to.equal("completed")
        expect(response.body.data.name).to.equal(bodyHabit.name)
        expect(response.body.data.description).to.equal(bodyHabit.description)
        expect(response.body.data.userId).to.be.a("number")
        expect(response.body.data.createdAt).to.be.a("string")
        expect(response.body.data.updatedAt).to.be.a("string")
    })

    it("Should return 200 unmarking a habit as completed today", async () => {
        await request(process.env.BASE_URL)
            .patch(`/api/habits/${habitId}/today`)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send({
                completed: true
            })

        const response = await request(process.env.BASE_URL)
            .patch(`/api/habits/${habitId}/today`)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send({
                completed: false
            })

        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal("Status diario do habito atualizado com sucesso.")
        expect(response.body.data.id).to.equal(habitId)
        expect(response.body.data.completedToday).to.equal(false)
        expect(response.body.data.statusToday).to.equal("pending")
    })

    it("Should return 400 when sending completed with invalid type", async () => {
        const response = await request(process.env.BASE_URL)
            .patch(`/api/habits/${habitId}/today`)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send({
                completed: "true"
            })

        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal("completed deve ser booleano.")
    })

    it("Should return 400 when sending request without completed", async () => {
        const response = await request(process.env.BASE_URL)
            .patch(`/api/habits/${habitId}/today`)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send({})

        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal("completed deve ser booleano.")
    })

    it("Should return 401 when updating habit status without bearer token", async () => {
        const response = await request(process.env.BASE_URL)
            .patch(`/api/habits/${habitId}/today`)
            .set("Content-Type", "application/json")
            .send({
                completed: true
            })

        expect(response.status).to.equal(401)
        expect(response.body.message).to.equal("Token Bearer nao informado.")
    })

    it("Should return 401 when updating habit status with an invalid token", async () => {
        const response = await request(process.env.BASE_URL)
            .patch(`/api/habits/${habitId}/today`)
            .set("Content-Type", "application/json")
            .set("Authorization", "Bearer token-invalido")
            .send({
                completed: true
            })

        expect(response.status).to.equal(401)
        expect(response.body.message).to.equal("Token invalido ou expirado.")
    })

    it("Should return 404 when updating status of a habit that does not exist", async () => {
        const response = await request(process.env.BASE_URL)
            .patch("/api/habits/999999/today")
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send({
                completed: true
            })

        expect(response.status).to.equal(404)
        expect(response.body.message).to.equal("Habito nao encontrado para o usuario autenticado.")
    })

    it("Should return 404 when updating status of another user's habit", async () => {
        const response = await request(process.env.BASE_URL)
            .patch(`/api/habits/${habitId}/today`)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${secondToken}`)
            .send({
                completed: true
            })

        expect(response.status).to.equal(404)
        expect(response.body.message).to.equal("Habito nao encontrado para o usuario autenticado.")
    })
})
