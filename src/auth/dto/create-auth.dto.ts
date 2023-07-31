import { Length, IsEmail, IsNotEmpty } from 'class-validator';

export class SignupDto {
  @Length(3, 18)
  @IsNotEmpty({ message: 'name is not empty' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'email is not empty' })
  @Length(8, 20)
  email: string;

  @Length(7, 15)
  @IsNotEmpty({ message: 'password is not empty' })
  password: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: 'email is not empty' })
  email: string;

  @IsNotEmpty({ message: 'password is not empty' })
  password: string;
}
