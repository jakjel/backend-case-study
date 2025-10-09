import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateTenantDTO {
    @ApiProperty({ required: true })
    @Transform(({ value }) => {
        if (!value || typeof value !== 'string') return undefined;
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    })
    lastname?: string;

    @ApiProperty({ required: true })
    @Transform(({ value }) => {
        if (!value || typeof value !== 'string') return undefined;
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    })
    firstname?: string;

    @ApiProperty({ required: true })
    @Transform(({ value }) => {
        if (!value || typeof value !== 'string') return undefined;
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    })
    email?: string;
}