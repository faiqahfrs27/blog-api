import { IsEmail, IsNotEmpty, isNotEmpty } from "class-validator";

export class ForgotPasswordDTO {
    @IsNotEmpty()
    @IsEmail()
    email!: string;
}