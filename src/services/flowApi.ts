// Dummy data as fallback
const DUMMY_DATA = {
  flow: [
    "Step 1: Introduce the concept of quantum computing as a new way of processing information using quantum bits or qubits.",
    "Step 2: Explain the differences between classical computing and quantum computing in terms of how they store and manipulate data.",
    "Step 3: Discuss the concept of superposition in quantum computing and how it allows qubits to exist in multiple states simultaneously.",
    "Step 4: Describe the idea of entanglement in quantum computing where qubits can be correlated with each other regardless of distance.",
    "Step 5: Show how quantum algorithms like Shor's algorithm and Grover's algorithm can solve problems much faster than classical algorithms.",
    "Step 6: Connect quantum computing to artificial intelligence by explaining how quantum algorithms can be used to optimize machine learning models.",
    "Step 7: Discuss the potential applications of quantum computing in AI, such as speeding up neural network training and improving optimization algorithms.",
    "Step 8: Provide examples of current research and development in the field of quantum computing for AI, showcasing the progress being made in this interdisciplinary area."
  ],
  teach: {
    assistant_reply: "Let's explore the concept of entities in databases. An entity represents a distinct object or item that we can store information about. Think of it like a category of things we want to track in our system. For example, in a school database, 'Student' would be an entity. Each entity has attributes that describe its characteristics, like a student's name, age, and grade level.",
    assistant_visual_aid: `<div class='grid grid-cols-2 gap-4'>
      <div class='bg-zinc-800/50 backdrop-blur p-4 rounded-lg'>
        <p class='text-white font-medium mb-2'>Definition:</p>
        <p class='text-white/80'>An entity is a distinct object or item that can be identified and stored in a database.</p>
      </div>
      <div class='bg-zinc-800/50 backdrop-blur p-4 rounded-lg'>
        <p class='text-white font-medium mb-2'>Example:</p>
        <p class='text-white/80'>A 'Student' as an entity in a school database with attributes like name, ID, and grade.</p>
      </div>
      <div class='bg-zinc-800/50 backdrop-blur p-4 rounded-lg'>
        <p class='text-white font-medium mb-2'>Characteristics:</p>
        <p class='text-white/80'>Entities have unique identifiers and attributes that describe their properties.</p>
      </div>
      <div class='bg-zinc-800/50 backdrop-blur p-4 rounded-lg'>
        <p class='text-white font-medium mb-2'>Real-World Analogy:</p>
        <p class='text-white/80'>Think of an entity like a form that collects specific information about something.</p>
      </div>
    </div>`,
    current_subtask: 0,
    doubt_chat_state: true
  }
};

const API_ENDPOINTS = {
  FLOW: 'https://api.example.com/api/v1/content/get-flow', // Update this with your actual API endpoint
  TEACH: 'https://3m4szz0n9l.execute-api.ap-south-1.amazonaws.com/Prod/teach'
};

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

export const getFlowData = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.FLOW, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        module: "RDBMS",
        topic: "Entity and Attributes",
        content_list: [
          {
            type: "pdf",
            url: "https://res.cloudinary.com/damg6iidi/image/upload/v1738232062/vzbxtb3ag6gb2b7kqinb.pdf"
          }
        ],
        question_list: []
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.teaching_flow || [];
  } catch (error) {
    console.log('API call failed, using dummy flow data');
    return DUMMY_DATA.flow;
  }
};

let lastTeachRequest: { promise: Promise<any>; timestamp: number } | null = null;
const DEBOUNCE_TIME = 500; // ms

export const getTeachingData = async (flow: string[], currentSubtask: number = 0, conversation_history: any[] = []) => {
  try {
    // Debounce requests
    const now = Date.now();
    if (lastTeachRequest && now - lastTeachRequest.timestamp < DEBOUNCE_TIME) {
      const result = await lastTeachRequest.promise;
      return result || DUMMY_DATA.teach;
    }

    const requestPromise = fetch(API_ENDPOINTS.TEACH, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({
        module: "RDBMS",
        topic: "Entity and Attributes",
        flow,
        current_subtask: currentSubtask,
        conversation_history: conversation_history.length > 0 ? conversation_history : [
          { role: "user", content: "" },
          { role: "assistant", content: "" }
        ],
        current_message: ""
      })
    })
    .then(async response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Check for error response
      if (data.assistant_reply === "Something went wrong, please try again." ||
          data.assistant_visual_aid === "An error occurred." ||
          data.current_subtask === -1) {
        console.log('Received error response from API, using dummy teaching data as fallback');
        return DUMMY_DATA.teach;
      }
      return data || DUMMY_DATA.teach;
    })
    .catch(error => {
      console.error('Error fetching teaching data:', error);
      console.log('Using dummy teaching data as fallback');
      return DUMMY_DATA.teach;
    });

    lastTeachRequest = {
      promise: requestPromise,
      timestamp: now
    };

    const result = await requestPromise;
    return result || DUMMY_DATA.teach;
  } catch (error) {
    console.error('Error in getTeachingData:', error);
    console.log('Using dummy teaching data as fallback');
    return DUMMY_DATA.teach;
  }
};