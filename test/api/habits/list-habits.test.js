const request = require("supertest")
const { expect } = require("chai")
require("dotenv").config()

const postHabit = require("../../infra/fixtures/postHabit.json")
const { authenticateUser } = require("../../infra/helpers/auth")
const { createHabit } = require("../../infra/helpers/habit")

describe("GET /api/habits", () => {
    let token
    let secondToken
    let bodyHabit

    beforeEach(async () => {
        token = await authenticateUser(`luana.${Date.now()}@test.com`)
        secondToken = await authenticateUser(`luana.other.${Date.now()}@test.com`)
        bodyHabit = { ...postHabit }
    })

    it("Should return 200 listing habits correctly", async () => {
        await createHabit(token, bodyHabit)

        const secondHabitBody = {
            ...bodyHabit,
            name: "Read 10 pages"
        }

        await createHabit(token, secondHabitBody)

        const response = await request(process.env.BASE_URL)
            .get("/api/habits")
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal("Habitos carregados com sucesso.")
        expect(response.body.data).to.be.an("array")
        expect(response.body.data).to.have.length(2)

        response.body.data.forEach((habit) => {
            expect(habit.id).to.be.a("number")
            expect(habit.userId).to.be.a("number")
            expect(habit.name).to.be.a("string")
            expect(habit.description).to.be.a("string")
            expect(habit.createdAt).to.be.a("string")
            expect(habit.updatedAt).to.be.a("string")
            expect(habit.completedToday).to.equal(false)
            expect(habit.statusToday).to.equal("pending")
        })
    })

    it("Should return 200 and an empty list when user has no habits", async () => {
        const response = await request(process.env.BASE_URL)
            .get("/api/habits")
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal("Nenhum habito cadastrado para este usuario.")
        expect(response.body.data).to.be.an("array")
        expect(response.body.data).to.have.length(0)
    })

    it("Should return 200 listing only authenticated user habits", async () => {
        await createHabit(token, bodyHabit)
        await createHabit(secondToken, {
            ...bodyHabit,
            name: "Exercise"
        })

        const response = await request(process.env.BASE_URL)
            .get("/api/habits")
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal("Habitos carregados com sucesso.")
        expect(response.body.data).to.be.an("array")
        expect(response.body.data).to.have.length(1)
        expect(response.body.data[0].name).to.equal(bodyHabit.name)
    })

    it("Should return 401 when listing habits without bearer token", async () => {
        const response = await request(process.env.BASE_URL)
            .get("/api/habits")
            .set("Content-Type", "application/json")

        expect(response.status).to.equal(401)
        expect(response.body.message).to.equal("Token Bearer nao informado.")
    })

    it("Should return 401 when listing habits with an invalid token", async () => {
        const response = await request(process.env.BASE_URL)
            .get("/api/habits")
            .set("Content-Type", "application/json")
            .set("Authorization", "Bearer token-invalido")

        expect(response.status).to.equal(401)
        expect(response.body.message).to.equal("Token invalido ou expirado.")
    })
})
