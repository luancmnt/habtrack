const request = require("supertest")
const { expect } = require("chai")
require('dotenv').config()
const postLogin = require('../../infra/fixtures/postLogin.json')

describe ("POST /api/auth/login", () => {
    const bodyLogin = { ...postLogin }

    it ("Should return 200 when logging in with an existent user", async () => {
        const response = await request(process.env.BASE_URL)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send(bodyLogin)

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Login realizado com sucesso.")
        expect(response.body.data.token).to.be.a('string')
    })

    it ("Should return 401 when logging in with an inexistent user", async () => {
        bodyLogin.email = "luana1@test.com"

        const response = await request(process.env.BASE_URL)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send(bodyLogin)
        
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal("Credenciais invalidas.")
    })

    it ("Should return 400 when sending a request with an invalid body", async () => {
        const response = await request(process.env.BASE_URL)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 
                password: '123456'
            })
        
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("email e password sao obrigatorios.")
    })
})