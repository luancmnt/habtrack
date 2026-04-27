const request = require("supertest")
const { expect } = require("chai")
require("dotenv").config()

const postLogin = require("../../infra/fixtures/postLogin.json")
const { registerUser } = require("../../infra/helpers/register")

describe("POST /api/auth/login", () => {
    let bodyLogin

    beforeEach(async () => {
        const email = `luana.${Date.now()}@test.com`
        const password = "123456"

        await registerUser(email, password, "Luana")

        bodyLogin = {
            ...postLogin,
            email,
            password
        }
    })

    it("Should return 200 when logging in with an existing user", async () => {
        const response = await request(process.env.BASE_URL)
            .post("/api/auth/login")
            .set("Content-Type", "application/json")
            .send(bodyLogin)

        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal("Login realizado com sucesso.")
        expect(response.body.data.token).to.be.a("string")
        expect(response.body.data.user.email).to.equal(bodyLogin.email)
        expect(response.body.data.user.id).to.be.a("number")
    })

    it("Should return 401 when logging in with a non-existing user", async () => {
        bodyLogin.email = "luana1@test.com"

        const response = await request(process.env.BASE_URL)
            .post("/api/auth/login")
            .set("Content-Type", "application/json")
            .send(bodyLogin)

        expect(response.status).to.equal(401)
        expect(response.body.message).to.equal("Credenciais invalidas.")
    })

    it("Should return 400 when sending a request with an invalid body", async () => {
        const response = await request(process.env.BASE_URL)
            .post("/api/auth/login")
            .set("Content-Type", "application/json")
            .send({
                password: "123456"
            })

        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal("email e password sao obrigatorios.")
    })
})
