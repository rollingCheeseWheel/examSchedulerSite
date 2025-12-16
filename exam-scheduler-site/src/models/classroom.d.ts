import type { Calendar } from "./calendar";

export interface Classroom {
    id: string;
    name: string;
    school: School;
    calendar: Calendar?;
}