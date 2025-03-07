// api.js
const baseUrl = process.env.NEXT_PUBLIC_SHODH_ML_URL;

export const generateNarrationAudioAPI = async (text, topic) => {
  try {
    console.log("Generating audio for text:", text);

    const response = await fetch(`${baseUrl}/api/narration/` + topic, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error response:", errorData);
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("Audio generation result:", result);

    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.audio_url) {
      throw new Error("No audio URL returned from server");
    }

    // Test audio availability before returning URL
    try {
      const audioTest = await fetch(result.audio_url);
      if (!audioTest.ok) {
        throw new Error(`Audio file not accessible: ${audioTest.status}`);
      }
    } catch (audioError) {
      console.error("Audio file test failed:", audioError);
      throw new Error("Generated audio file is not accessible");
    }

    return result;
  } catch (error) {
    console.error("Error generating audio:", error);
    throw error;
  }
};

// api.js
export const fetchVisualizationAPI = async (topic) => {
  try {
    const response = await fetch(`${baseUrl}/api/visualization`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching visualization:", error);
    throw error;
  }
};

export const processDoubtAPI = async (
  doubt,
  topic,
  currentState,
  relevantNodes
) => {
  try {
    const response = await fetch(`${baseUrl}/api/process-doubt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        doubt,
        topic,
        currentState,
        relevantNodes,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error processing doubt:", error);
    throw error;
  }
};
