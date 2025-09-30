
// customer.dto.ts
import { ApiProperty } from '@nestjs/swagger';

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
}