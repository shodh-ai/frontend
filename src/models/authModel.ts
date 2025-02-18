export interface LoginWithPasswordRequestBody{
    username:string,
    password:string,
    role:number,
}
export interface UserDataInterface{
  facultyId:number;
  password: string;
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
  