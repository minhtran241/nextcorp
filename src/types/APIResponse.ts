export default interface ApiResponse<T> {
    status: number;
    message?: string;
    data?: T;
    timestamp: Date;
}
