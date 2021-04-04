import { hash } from 'bcryptjs';

import { v4 as uuidV4 } from 'uuid';
import { Connection } from "typeorm";
import  createConnection  from '../../../../database';

import request from "supertest"
import { app } from "../../../../app"

let connection: Connection;

describe("Authenticate User Controller", ()=>{

  beforeAll(async ()=>{
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("12345678",8);

        await connection.query(
            `INSERT INTO USERS(id,name,email,password,created_at)
            values('${id}', 'admin', 'testUser@test.com.br', '${password}', 'now()')
            `
        );

});

afterAll(async ()=>{
  await connection.dropDatabase();
  await connection.close();

})

   it("should be able to authenticate an user",async()=>{
   const response =  await request(app).post("/api/v1/sessions").send({

      email:"testUser@test.com.br",
      password:"12345678",

    });

    expect(response.body).toHaveProperty("token");
   })

   it("should be able authenticate  an none existent user",async()=>{
    const response =  await request(app).post("/api/v1/sessions").send({

       email:"User@test.com.br",
       password:"12345678",

     });

     expect(response.status).toBe(401);
    })

    it("should be able authenticate  with incorrect email",async()=>{
      const response =  await request(app).post("/api/v1/sessions").send({

         email:"incorrectPassword",
         password:"12345678",

       });

       expect(response.status).toBe(401);
      })

    it("should be able authenticate  with incorrect password",async()=>{
      const response =  await request(app).post("/api/v1/sessions").send({

         email:"testUser@test.com.br",
         password:"incorrectPassword",

       });

       expect(response.status).toBe(401);
      })



})
