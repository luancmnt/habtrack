const request = require("supertest")
const { expect } = require("chai")
require("dotenv").config()

const postRegister = require("../../infra/fixtures/postRegister.json")
const { registerUser } = require("../../infra/helpers/register")

describe("POST /api/auth/register", () => {
    let bodyRegister

    beforeEach(() => {
        bodyRegister = {
            ...postRegister,
            email: `luana.${Date.now()}@email.com`
        }
    })

    it("Should return 201 creating a user correctly", async () => {
        const response = await request(process.env.BASE_URL)
            .post("/api/auth/register")
            .set("Content-Type", "application/json")
            .send(bodyRegister)

        expect(response.status).to.equal(201)
        expect(response.body.message).to.equal("Usuario cadastrado com sucesso.")
        expect(response.body.data.token).to.be.a("string")
        expect(response.body.data.user.name).to.equal(bodyRegister.name)
        expect(response.body.data.user.email).to.equal(bodyRegister.email)
        expect(response.body.data.user.id).to.be.a("number")
        expect(response.body.data.user.createdAt).to.be.a("string")
    })

    it("Should return 400 when creating a user with an invalid email", async () => {
        bodyRegister.email = "luanateste"

        const response = await request(process.env.BASE_URL)
            .post("/api/auth/register")
            .set("Content-Type", "application/json")
            .send(bodyRegister)

        expect(response.status).to.equal(400)
    })

    it("Should return 400 when creating a user without required fields", async () => {
        delete bodyRegister.name

        const response = await request(process.env.BASE_URL)
            .post("/api/auth/register")
            .set("Content-Type", "application/json")
            .send(bodyRegister)

        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal("name, email e password sao obrigatorios.")
    })

    it("Should return 409 when creating a user with an email already registered", async () => {
        await registerUser(bodyRegister.email, bodyRegister.password, bodyRegister.name)

        const response = await request(process.env.BASE_URL)
            .post("/api/auth/register")
            .set("Content-Type", "application/json")
            .send(bodyRegister)

        expect(response.status).to.equal(409)
        expect(response.body.message).to.equal("Ja existe usuario cadastrado com este email.")
    })
})
