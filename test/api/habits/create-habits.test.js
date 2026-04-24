const request = require("supertest")
const { expect } = require("chai")
require('dotenv').config()
const postHabit = require("../../infra/fixtures/postHabit.json")
const { authenticateUser } = require("../../infra/helpers/auth")

describe("POST /api/habits", () => {
    let token
    let bodyHabit

    beforeEach(async () => {
        token = await authenticateUser(`luana.${Date.now()}@test.com`)
        bodyHabit = { ...postHabit }
    })

    it("Should return 201 creating a habit correctly", async () => {
        const response = await request(process.env.BASE_URL)
            .post("/api/habits")
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send(bodyHabit)

        expect(response.status).to.equal(201)
        expect(response.body.message).to.equal("Habito criado com sucesso.")
        expect(response.body.data).to.include({
            name: bodyHabit.name,
            description: bodyHabit.description
        })
        expect(response.body.data.id).to.be.a("number")
        expect(response.body.data.userId).to.be.a("number")
        expect(response.body.data.completedToday).to.equal(false)
        expect(response.body.data.statusToday).to.equal("pending")
        expect(response.body.data.createdAt).to.be.a("string")
        expect(response.body.data.updatedAt).to.be.a("string")
    })

    it("Should return 201 creating a habit with only name", async () => {
        delete bodyHabit.description

        const response = await request(process.env.BASE_URL)
            .post("/api/habits")
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send(bodyHabit)

        expect(response.status).to.equal(201)
        expect(response.body.message).to.equal("Habito criado com sucesso.")
        expect(response.body.data.name).to.equal(bodyHabit.name)
        expect(response.body.data.description).to.equal("")
    })

    it("Should return 400 when creating a habit without name", async () => {
        delete bodyHabit.name

        const response = await request(process.env.BASE_URL)
            .post("/api/habits")
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send(bodyHabit)

        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal("name e obrigatorio.")
    })

    it("Should return 400 when creating a habit with an empty name", async () => {
        bodyHabit.name = "   "

        const response = await request(process.env.BASE_URL)
            .post("/api/habits")
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send(bodyHabit)

        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal("name e obrigatorio.")
    })

    it("Should return 401 when creating a habit without bearer token", async () => {
        const response = await request(process.env.BASE_URL)
            .post("/api/habits")
            .set("Content-Type", "application/json")
            .send(bodyHabit)

        expect(response.status).to.equal(401)
        expect(response.body.message).to.equal("Token Bearer nao informado.")
    })

    it("Should return 401 when creating a habit with an invalid token", async () => {
        const response = await request(process.env.BASE_URL)
            .post("/api/habits")
            .set("Content-Type", "application/json")
            .set("Authorization", "Bearer token-invalido")
            .send(bodyHabit)

        expect(response.status).to.equal(401)
        expect(response.body.message).to.equal("Token invalido ou expirado.")
    })
})
