import type { AutoLockIn } from "./enums";

export interface Schedule {
    id: string;
    autoLockIn: number | AutoLockIn;
    // TODO finish translating models
}