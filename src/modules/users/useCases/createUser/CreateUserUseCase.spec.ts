import { CreateUserError } from './CreateUserError';
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';


let createUserUseCase : CreateUserUseCase;
let userRepositoryInMemory : InMemoryUsersRepository;

describe("Create User",()=>{

  beforeEach(()=>{
    userRepositoryInMemory =  new InMemoryUsersRepository();
    createUserUseCase =  new CreateUserUseCase(userRepositoryInMemory);
  })

  it("Should be able to create new user", async()=>{

      const user = await createUserUseCase.execute({
        name: "Test User",
        email:"Test@test.com.br",
        password:"123456789"
      })

      expect(user).toHaveProperty("id")
  })


  it("Should be able to create a user  with exist email ", async()=>{

   expect(async ()=>{
    await createUserUseCase.execute({
      name: "Test User",
      email:"Test@test.com.br",
      password:"123456789"
    })

    await createUserUseCase.execute({
      name: "Test User 2",
      email:"Test@test.com.br",
      password:"123456789"
    })
   }).rejects.toBeInstanceOf(CreateUserError)

})


})
