import { Connection } from "typeorm";
import  createConnection  from '../../../../database';

import request from "supertest"
import { app } from "../../../../app"

let connection: Connection;

describe("Create User Controller", ()=>{

  beforeAll(async ()=>{
    connection = await createConnection();
    await connection.runMigrations();

});

afterAll(async ()=>{
  await connection.dropDatabase();
  await connection.close();

})

   it("should be able to create a new user",async()=>{
   const response =  await request(app).post("/api/v1/users").send({
      name:"Test User",
      email:"testUser@test.com.br",
      password:"12345678",

    });


    expect(response.status).toBe(201);
   })


   it("should be able to create a new user with email exists",async()=>{
    const response =  await request(app).post("/api/v1/users").send({
       name:"Test User",
       email:"testUser@test.com.br",
       password:"12345678",

     });


     expect(response.status).toBe(400);
    })
})
