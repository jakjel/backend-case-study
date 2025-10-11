import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Subscription } from './subscription';

export class UpdateCustomerDTO {
    @ApiProperty()
    @Transform(({ value }) => {
        if (!value || typeof value !== 'string') return undefined;
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    })
    username: string;

    @ApiProperty()
    @Transform(({ value }) => {
        if (!value || typeof value !== 'string') return undefined;
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }) 
    avatar: string;

    @ApiProperty()
    @Transform(({ value }) => {
        if (!value || typeof value !== 'string') return undefined;
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }) 
    birthday: Date;

    @ApiProperty()
    @Transform(({ value }) => {
        if (!value || typeof value !== 'string') return undefined;
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }) 
    firstName: string;

    @ApiProperty()
    @Transform(({ value }) => {
        if (!value || typeof value !== 'string') return undefined;
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }) 
    lastName: string;

    @ApiProperty()
    subscription: Subscription;
}