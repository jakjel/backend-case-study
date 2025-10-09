import { Payment } from "../payment";
import { Tenant } from "../tenant";

export class SubscriptionResponseDTO {
    subscriptionId: string
    tenant: Tenant;
    createdAt: Date;
    startDate: Date;
    endDate: Date;
    prepaidKWh: number;
    payments?: Payment[];
}