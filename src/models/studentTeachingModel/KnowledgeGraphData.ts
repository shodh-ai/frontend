export interface Course {
    courseId: number;
    title: string;
    description: string;
    archived: string;
    created_date: string;
    modified_date: string;
    creator_user_id: number | null;
    creator_role: string | null;
    modifier_user_id: number | null;
    modifier_role: string | null;
    course_duration: string;
    start_date: string;
    end_date: string;
  }
  
  export interface Module {
    moduleId: number;
    title: string;
    description: string;
    archived: string;
    created_date: string;
    modified_date: string;
    creator_user_id: number | null;
    creator_role: string | null;
    modifier_user_id: number | null;
    modifier_role: string | null;
    module_duration: string;
    course: Course;
  }
  
  export interface TopicType {
    topic_type_id: number;
    topic_type_name: string;
    archived: string;
    created_date: string;
    modified_date: string;
  }
  
  export interface Topic {
    topicId: number;
    module_id: Module;
    topic_type_id: TopicType;
    title: string;
    description: string;
    archived: string;
    created_date: string;
    modified_date: string;
    creator_user_id: number | null;
    creator_role: string | null;
    modifier_user_id: number | null;
    modifier_role: string | null;
    topic_duration: string;
  }
  
  export interface TopicData {
    topic: Topic;
    sub_topic: Topic[];
  }
  
  export interface KnowledgeDataApiResponse {
    message: string;
    data: TopicData[];
    status: string;
    status_code: number;
  }
  