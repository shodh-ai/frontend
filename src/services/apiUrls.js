export const endPoints = {
    auth:{
        LOGIN_WITH_EMAIL_PASSWORD:"auth/login-with-username-password",
    },
    student:{
        GET_STUDENT_DASHBOARD : "student/get-student-by-id",
        GET_ALL_STUDENT_LEADERSHIP_SCORE : "student/get-leaderboard"
    },
    studentSimulation:{
        HANDLE_DECISION_SIMULATION:"api/simulation/decisions/action",
        HANDLE_DECISION_SPECIFIC:"api/simulation/decisions/discuss-specific",
        START_SIMULATION:"api/simulation/start",
        SUBMIT_SIMULATION:"api/simulation/decisions/submit"
    },
    doubts:{
        HANDLE_STUDENTS_DOUBTS : "doubt",
        ASK_DOUBT:"ask_doubt"
    },
    studentTeaching:{
        GET_ALL_TOPICS_BY_MODULE:"topic/get-all"
    }
}