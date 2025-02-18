

export interface GetStudentDashboardParams {
    student_id: number | undefined; 
  }
  
  
  export interface ErrorMessage {
    error: string; 
  }
  
// export interface Role {
//     role_id: number;
//     created_date: string;
//     role_name: string;
//     modified_date: string;
//   }
  
//   export interface Gender {
//     gender_id: number;
//     gender_symbol: string;
//     gender_name: string;
//   }
  
//   export interface AcademicDegree {
//     degreeId: number;
//     degree_name: string;
//     program_name: string;
//     institution_name: string;
//     archived: string;
//     created_date: string;
//     modified_date: string;
//   }
  
//   export interface Accuracy {
//     accuracy_id: number;
//     accuracy: number;
//     accuracy_improvement_flag: string | null;
//     accuracy_improvement: number;
//     created_date: string;
//     modified_date: string;
//   }
  
//   export interface CriticalThinking {
//     critical_thinking_id: number;
//     critical_thinking: number;
//     critical_thinking_improvement_flag: string | null;
//     critical_thinking_improvement: number;
//     created_date: string;
//     modified_date: string;
//   }
  
//   export interface TimeSpent {
//     time_spent_id: number;
//     time_spent: number;
//     time_spent_increased: number;
//     created_date: string;
//     modified_date: string;
//   }
  
//   export interface StudentData {
//     student_id: number;
//     archived: string;
//     first_name: string;
//     last_name: string;
//     college_email: string;
//     personal_email: string;
//     country_code: string;
//     mobile_number: string;
//     date_of_birth: string;
//     role: Role;
//     gender: Gender;
//     token: string | null;
//     user_name: string;
//     created_date: string;
//     modified_date: string;
//     academic_degree: AcademicDegree;
//     marks_obtained: number;
//     total_marks: number;
//     marks_improvement: number;
//     accuracy: Accuracy;
//     critical_thinking: CriticalThinking;
//     profile_picture_url: string;
//     time_spent: TimeSpent;
//   }
  

  export interface SemesterScore {
    label: string;          
    value: number;          
    improved_value: number; 
    improved_flag: boolean | null; 
  }
  
  