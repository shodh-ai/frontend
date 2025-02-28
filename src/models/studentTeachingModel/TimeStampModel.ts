export interface TimeStamp{
    timestamp:number;
}
export interface UpdateTimeStampResponse{
    message:string;
    data:TimeStamp[];
    status:string;
    status_code:number;
}