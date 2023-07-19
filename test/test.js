import chaiHttp from "chai-http";
import chai, { expect } from "chai";

import app from "../index.js";

chai.use(chaiHttp);

describe('Probando API REST con Mocha - Chai', function () {

    it('Probando GET - La data debe ser un objeto', function(){
        chai
            .request(app)
            .get('/api/v1/anime')
            .end(function (err, res) {
                let data = JSON.parse(res.text);
                chai.expect(data).to.be.an('object');
            });
    });

    it('Probando POST - accion create' , function() {
        chai
            .request(app)
            .post('/api/v1/anime')
            .send({"nombre": 'Super Campeones', "genero": "Futbol" , "año": "1982", "autor": "Yoichi Takahashi" })
            .end( function(err, res) {
                expect(res).to.have.status(201);
            })
    })
});
