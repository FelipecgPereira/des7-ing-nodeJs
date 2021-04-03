import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';
import { ICreateUserDTO } from './../createUser/ICreateUserDTO';
import { CreateUserUseCase } from './../createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let authenticateUserUseCase : AuthenticateUserUseCase;
let userRepositoryInMemory : InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe("Authenticate user",()=>{

  beforeEach(()=>{
  userRepositoryInMemory = new  InMemoryUsersRepository();
  authenticateUserUseCase = new  AuthenticateUserUseCase(userRepositoryInMemory);
  createUserUseCase = new  CreateUserUseCase(userRepositoryInMemory);
  })

  it("should be able to authenticate an user", async ()=>{
    const user : ICreateUserDTO={
      name: "Test User",
      email:"Test@test.com.br",
      password:"123456789"
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(result).toHaveProperty("token");
  })

  it("should be able authenticate  an none existent user", async ()=>{

   expect(async ()=>{
    await authenticateUserUseCase.execute({
      email: "Test@test.com.br",
      password: "123456789"
    })
   }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

  })

  it("should be able authenticate  with incorrect password", async ()=>{
   expect(async()=>{
    const user : ICreateUserDTO={
      name: "Test User",
      email:"Test@test.com.br",
      password:"123456789"
    };

    await createUserUseCase.execute(user);

    await authenticateUserUseCase.execute({
      email: user.email,
      password: "incorretPassword"
    })
   }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

  })

  it("should be able authenticate  with incorrect email", async ()=>{
    expect(async()=>{
     const user : ICreateUserDTO={
       name: "Test User",
       email:"Test@test.com.br",
       password:"123456789"
     };

     await createUserUseCase.execute(user);

     await authenticateUserUseCase.execute({
       email: "incorrectEmail",
       password: user.password
     })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

   })


})
