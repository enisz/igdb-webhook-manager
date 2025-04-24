import { IsString, Length } from "class-validator";

export class AuthenticateDto {
    @IsString()
    @Length(30, 30, { message: 'clientId must be exactly 30 characters long!' })
    clientId: string;

    @IsString()
    @Length(30, 30, { message: 'clientSecret must be exactly 30 characters long!' })
    clientSecret: string;
}