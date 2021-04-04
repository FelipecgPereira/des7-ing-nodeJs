import { hash } from 'bcryptjs';

import { v4 as uuidV4 } from 'uuid';
import { Connection } from "typeorm";
import  createConnection  from '../../../../database';

import request from "supertest"
import { app } from "../../../../app"

let connection: Connection;

describe("Show Profile User Controller", ()=>{

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


it("should be able to show profiles",async()=>{
  const responseToken =  await request(app).post("/api/v1/sessions").send({

     email:"testUser@test.com.br",
     password:"12345678",

   });

   const {token}= responseToken.body;

   const response = await request(app).get("/api/v1/profile")
   .send({})
   .set({
    Authorization: `Bearer ${token}`
    })

    expect(response.status).toBe(200);

  })
})
