import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';


let showUserProfileUseCase : ShowUserProfileUseCase;
let userRepositoryInMemory : InMemoryUsersRepository;

describe("List Profiles",()=>{

  beforeEach(()=>{
    userRepositoryInMemory =  new InMemoryUsersRepository();
    showUserProfileUseCase =  new ShowUserProfileUseCase(userRepositoryInMemory);
  })


  it("should be able to list user by id",async ()=>{
      const user = await userRepositoryInMemory.create({
        name: "Test User",
        email:"Test@test.com.br",
        password:"123456789"
      })


      const userExist = await showUserProfileUseCase.execute({user_id: user.id as string});

      expect(userExist).toEqual(user)
  })

})
