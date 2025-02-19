export interface LoginWithPasswordRequestBody{
    username:string,
    password:string,
    role:number,
}
export interface UserDataInterface{
  student_id:number;
  mobile_number: string;
  username: string;
}
export interface LoginWithPasswordResponse {
    token: string;
    message: string;
    data: {
      userDetails: UserDataInterface;
    };
    status_code: number;
    status: string;
  }
  