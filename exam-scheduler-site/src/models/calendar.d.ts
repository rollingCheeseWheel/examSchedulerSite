export interface Calendar {
    id: string;
    lastsUntil: string;
    lessons: Lesson[];
    classroom: Classroom;
}

export interface Lesson {
    id: string;
    occurances: string[];
    fromHour: number;
    toHour: number;
    lessonName: string;
    teachers: Teacher[];
    subject: Subject;
}

export interface Teacher {
    firstName: string;
    lastName: string;
}

export interface Subject {
    name: string;
}