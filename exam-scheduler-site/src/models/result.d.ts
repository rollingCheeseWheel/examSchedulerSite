export interface Result<T> {
    errors?: object[]?;
    data?: T?;
    statusCode: number;
    success: boolean;
}