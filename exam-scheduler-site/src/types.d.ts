export interface GenericResponse<T> {
    result: T?;
    errors: object[];
    success: boolean;
}

export interface School {
    name: string,
    registerUri: string,
    clientId: string
}