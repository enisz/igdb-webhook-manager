import { IsString, Length, Matches } from "class-validator";

export class AuthorizationHeaderDto {
    @IsString()
    @Length(30, 30, { message: 'Client-ID must be exactly 30 characters long!' })
    'Client-ID': string;

    @IsString()
    @Matches(new RegExp('^Bearer [a-z0-9]{30}$'))
    'Authorization': string;
}