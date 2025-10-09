import { Subscription } from "../subscription";
import { HousingUnit } from "../housing-unit";

export class TenantResponseDTO {
    tenant_id: string;
    lastname: string;
    firstname: string;
    email: string;
    created_at: Date;
    updated_at: Date;
    subscriptions?: Subscription[];
    housingUnit?: HousingUnit;
}