import { IsAlphanumeric, IsEmail, IsEmpty, IsString, IsStrongPassword, isAlphanumeric } from "class-validator";

interface IUserLogin {
  email: string;
  password: string;
}

export class UserLogin implements IUserLogin {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  constructor(it: IUserLogin) {
    this.email = it?.email;
    this.password = it?.password;
  }
}

interface IUserSignUp {
  name?: string;
  email: string;
  password: string;
  username:  string;

}

export class UserSignUp implements IUserSignUp {
  @IsString()
  name?: string;

  @IsString()
  @IsAlphanumeric()
  username:  string

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  constructor(it: IUserSignUp) {
    this.name = it?.name;
    this.email = it?.email;
    this.password = it?.password;
    this.username =  it?.username
  }
}
