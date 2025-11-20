export interface GenericResponse<T> {
    result: T?;
    errors: object[];
    success: boolean;
}