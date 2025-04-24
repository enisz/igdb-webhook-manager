import { Body, Controller, Delete, Get, Logger, Param, Post } from '@nestjs/common';
import { AuthorizationHeaders } from './authorization-headers.decorator';
import { AuthenticateDto } from './dto/authenticate.dto';
import { AuthorizationHeaderDto } from './dto/authorization-header.dto';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { EndpointType, IAuthenticateResponse, IWebhook } from './igdb.interface';
import { IgdbService } from './igdb.service';

@Controller('igdb')
export class IgdbController {
    private readonly logger = new Logger(IgdbController.name);

    constructor(private readonly igdbService: IgdbService) {}

    @Post('authenticate')
    async authenticate(@Body() authenticateDto: AuthenticateDto): Promise<IAuthenticateResponse> {
        return this.igdbService.authenticate(authenticateDto);
    }

    @Get('webhooks')
    async getWebhooks(@AuthorizationHeaders(AuthorizationHeaderDto) authorizationHeader): Promise<IWebhook[]> {
        return this.igdbService.getWebhooks(authorizationHeader);
    }

    @Get('webhook/:webhookId')
    async getWebhook(
        @AuthorizationHeaders(AuthorizationHeaderDto) authorizationHeader,
        @Param('webhookId') webhookId: number
    ): Promise<IWebhook> {
        return this.igdbService.getWebhook(authorizationHeader, webhookId);
    }

    @Post('webhook/:endpoint')
    async createWebhook(
        @AuthorizationHeaders(AuthorizationHeaderDto) authorizationHeaders,
        @Param('endpoint') endpoint: EndpointType,
        @Body() createWebhookDto: CreateWebhookDto,
    ): Promise<IWebhook> {
        return this.igdbService.createWebhook(authorizationHeaders, endpoint, createWebhookDto);
    }

    @Delete('webhook/:webhookId')
    async deleteWebhook(
        @AuthorizationHeaders(AuthorizationHeaderDto) authorizationHeaderDto,
        @Param('webhookId') webhookId: number
    ): Promise<IWebhook> {
        return this.igdbService.deleteWebhook(authorizationHeaderDto, webhookId);
    }
}
