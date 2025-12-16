export interface UserProfile {
    guid: string;

}

export interface Schedule {
    subject: string;
    slots: ScheduleSlot[];
}

export interface ScheduleSlot {
	date: string;
	lockinDate: string;
	guid: string;
	requiredParticipants: number;
	maxParticipants: number;
	participants:
}