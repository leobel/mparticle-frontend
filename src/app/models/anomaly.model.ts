export interface Anomaly {
    type: AnomalyTypeEnum;
    title: string;
    description: string;
    isRead?: boolean;
}

export enum AnomalyTypeEnum {
    moderate = 'moderate',
    important = 'important',
    critical = 'critical',
}