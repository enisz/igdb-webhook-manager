import { IsIn, IsString, IsUrl } from "class-validator";

export type WebhookMethodType = 'create' | 'delete' | 'update';

export class CreateWebhookDto {
    @IsString()
    @IsUrl()
    url: string;

    @IsString()
    @IsIn(['create', 'delete', 'update'])
    method: WebhookMethodType;

    @IsString()
    secret: string;
}