export interface IWebhook {
    id: number;
    url: string;
    category: number;
    sub_category: number;
    active: boolean;
    number_of_retries: number;
    api_key: string;
    secret: string;
    created_at: number;
    updated_at: number;
}

export interface IAuthenticateResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}
