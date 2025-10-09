// import { ApiProperty } from '@nestjs/swagger';
// import { Transform } from 'class-transformer';

// export class UpdateSubscriptionDTO {
//     @ApiProperty({ required: true })
//     @Transform(({ value }) => {
//         if (!value || typeof value !== 'string') return undefined;
//         const trimmed = value.trim();
//         return trimmed.length > 0 ? trimmed : undefined;
//     })
//     startDate?: Date;

//     @ApiProperty({ required: true })
//     @Transform(({ value }) => {
//         if (!value || typeof value !== 'string') return undefined;
//         const trimmed = value.trim();
//         return trimmed.length > 0 ? trimmed : undefined;
//     })
//     endDate?: string;
// }