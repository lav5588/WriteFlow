
export interface ApiResponse{
    status: number;
    success:boolean;
    message:string;
    data?:object;
    error?:any;
}