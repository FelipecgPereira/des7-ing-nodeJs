import { User } from './../../entities/User';
import { injectable, inject } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";

interface IRequest{
  user_id: string
}

@injectable()
export class ShowUserProfileUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({user_id}: IRequest){
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ShowUserProfileError();
    }

    return user;
  }
}
