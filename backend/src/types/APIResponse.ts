// APIResponse interface
export default interface ApiResponse {
    status: number;
    message?: string;
    data?: any;
    timestamp: Date;
}
