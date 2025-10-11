// customer.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Subscription } from './subscription';

export class CustomerResponseDTO {
    @ApiProperty()
    userId: string;
    @ApiProperty()
    username: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    avatar: string;
    @ApiProperty()
    birthday: Date;
    @ApiProperty()
    firstName: string;
    @ApiProperty()
    lastName: string;
    @ApiProperty()
    registeredAt: Date;
    @ApiProperty()
    subscription: Subscription | undefined;
}