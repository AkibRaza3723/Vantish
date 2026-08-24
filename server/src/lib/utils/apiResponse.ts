
interface data<T>{
    content:T;
}


class ApiResponse<T> {
    statusCode: number;
    data: data<T> ;
    message: string;
    success: boolean;
    constructor(statusCode: number, data: data<T> , message: string) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = true;
    }
}

export default ApiResponse;