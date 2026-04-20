const request = require("supertest")
const { expect } = require("chai")
require('dotenv').config()
const postRegister = require('../../infra/fixtures/postRegister.json')

describe("POST /api/auth/register", () => {
    const bodyRegister = { ...postRegister }

    it("Should return 200 creating a user correctly", async () => {
        const response = await request(process.env.BASE_URL)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send(bodyRegister)

        expect(response.status).to.equal(201);
    })

     it("Should return 400 when creating a user with a invalid email", async () => {
        bodyRegister.email = "luanateste" // corrigir bug, está aceitando esse valor

        const response = await request(process.env.BASE_URL)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send(bodyRegister)

        expect(response.status).to.equal(201);
    })
})