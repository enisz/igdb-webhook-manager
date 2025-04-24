import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AuthenticateDto } from './dto/authenticate.dto';
import { AuthorizationHeaderDto } from './dto/authorization-header.dto';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { IGDB_API, IGDB_ENDPOINTS } from './igdb.const';
import { IAuthenticateErrorData, IAuthenticateResponse, IWebhook } from './igdb.interface';

@Injectable()
export class IgdbService {
    private readonly logger = new Logger(IgdbService.name);

    constructor(private readonly httpService: HttpService) { }

    getApiUrl(segment?: string): string {
        return `${IGDB_API}${ segment ? `/${segment}` : ''}`;
    }

    async authenticate(authenticateDto: AuthenticateDto): Promise<IAuthenticateResponse> {
        const { clientId, clientSecret } = authenticateDto;

        const { data } = await firstValueFrom(this.httpService.post<IAuthenticateResponse>(
            `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
        ).pipe(catchError(this.handleIgdbError.bind(this))));

        return data;
    }

    async getWebhooks(authorizationHeader: AuthorizationHeaderDto): Promise<IWebhook[]> {
        const { data } = await firstValueFrom(this.httpService.get<IWebhook[]>(
            this.getApiUrl('webhooks'), { headers: { ...authorizationHeader } }
        ).pipe(catchError(this.handleIgdbError.bind(this))));

        return data;
    }

    async getWebhook(authorizationHeader: AuthorizationHeaderDto, webhookId: number): Promise<IWebhook> {
        const { data } = await firstValueFrom(this.httpService.get<IWebhook[]>(
            this.getApiUrl(`webhooks/${webhookId}`), { headers: { ...authorizationHeader } }
        ).pipe(catchError(this.handleIgdbError.bind(this))));

        return data[0];
    }

    async createWebhook(authorizationHeader: AuthorizationHeaderDto, endpoint: string, createWebhookDto: CreateWebhookDto): Promise<IWebhook> {
        if (!this.isValidEndpoint(endpoint)) throw new BadRequestException('Invalid endpoint');

        const { data } = await firstValueFrom(this.httpService.post<IWebhook[]>(
            this.getApiUrl(`${endpoint}/webhooks`), createWebhookDto, { headers: { ...authorizationHeader, "Content-Type": 'application/x-www-form-urlencoded' }}
        ).pipe(catchError(this.handleIgdbError.bind(this))));

        return data[0];
    }

    async deleteWebhook(authorizationHeader: AuthorizationHeaderDto, webhookId: number): Promise<IWebhook> {
        const { data } = await firstValueFrom(this.httpService.delete<IWebhook[]>(
            this.getApiUrl(`webhooks/${webhookId}`), { headers: { ...authorizationHeader }}
        ).pipe(catchError(this.handleIgdbError.bind(this))));

        return data[0];
    }

    private handleIgdbError(error: AxiosError): never {
        const { status, message } = error.response?.data as IAuthenticateErrorData;
        this.logger.error(`[${status}] ${message}`);
        this.logger.debug(error.response?.data)

        if (status) {
            throw new HttpException(message, status);
        }

        throw new InternalServerErrorException();
    }

    private isValidEndpoint(endpoint: string): boolean {
        return IGDB_ENDPOINTS.includes(endpoint);
    }
}
