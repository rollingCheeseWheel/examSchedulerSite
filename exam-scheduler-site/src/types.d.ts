export interface GenericResponse<T> {
	result: T?;
	errors: object[];
	success: boolean;
}

export interface School {
	name: string;
	registerUri: string;
	clientId: string;
}

export interface ExamSchedule {
	id: number;
	subject: string;
	selectDateId: number;
	description?: string;
	teacher: Teacher[];
	dates: ExamScheduleDate[];
}

export interface ExamScheduleDate {
	id: number;
	date: string;
	requiredParticipants: number;
	maximumParticipants: number;
	participants: User[];
}

export interface User {
	id: number;
	firstName: string;
	lastName: string;
}

export interface Teacher extends User {}
