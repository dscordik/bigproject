import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {ProviderOptionsSymbol} from "@/auth/provider/provider.constants";
import type {TypeOptions} from "@/auth/provider/provider.constants";
import {BaseOAuthService} from "@/auth/provider/services/base-oauth.service";

@Injectable()
export class ProviderService implements OnModuleInit{
    public constructor(@Inject(ProviderOptionsSymbol) private readonly options: TypeOptions) {}

    public onModuleInit() {
        for (const provider of this.options.services) {
            provider.baseURL = this.options.baseUrl
        }
    }

    public findByService(service: string): BaseOAuthService | null {
        return this.options.services.find(s => s.name === service) ?? null;
    }
}
