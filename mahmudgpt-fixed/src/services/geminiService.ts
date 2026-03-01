import { Language } from "@/store/languageStore";
import { apiService } from "./apiService";

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

// Function to check if a prompt is asking about the name or identity
function isNameRelatedQuestion(prompt: string): boolean {
  const lowercasePrompt = prompt.toLowerCase();
  const namePatterns = [
    'who are you',
    'what is your name',
    'what\'s your name',
    'your name',
    'introduce yourself',
    'who am i talking to',
    'what should i call you',
    'what are you called',
    'what are you',
    'what is this',
    'who made you',
    'who created you',
    'who is your creator',
    'who is your developer',
    'who is your owner',
    'who built you',
    'tell me about your creator',
    'about you'
  ];
  
  return namePatterns.some(pattern => lowercasePrompt.includes(pattern));
}

// Function to check if a prompt is asking what the AI is doing
function isDoingQuestion(prompt: string): boolean {
  const lowercasePrompt = prompt.toLowerCase();
  const doingPatterns = [
    'what are you doing',
    'what\'s up',
    'what is up',
    'how are you doing',
    'what are you up to',
    'how are things',
    'how is it going',
    'how\'s it going',
    'how have you been',
    'how are you',
    'how do you do',
  ];
  
  return doingPatterns.some(pattern => lowercasePrompt.includes(pattern));
}

// Function to check if the prompt is about eating at specific times
function isEatingTimeQuestion(prompt: string): boolean {
  const lowercasePrompt = prompt.toLowerCase();
  const eatingPatterns = [
    'what should i eat',
    'what to eat',
    'food suggestions',
    'meal ideas',
    'breakfast ideas',
    'lunch ideas',
    'dinner ideas',
    'food for',
    'eat for',
    'eating time',
    'when to eat',
    'what time should i eat',
    'mealtime',
    'good food for',
    'recommend food',
    'food recommendation',
  ];
  
  // Check for time-related patterns
  const timePatterns = [
    'breakfast',
    'lunch',
    'dinner',
    'morning',
    'afternoon',
    'evening',
    'night',
    'midnight',
    'snack',
    'brunch',
    'supper',
  ];
  
  // First, check if it's a food-related question
  const isFoodQuestion = eatingPatterns.some(pattern => lowercasePrompt.includes(pattern));
  
  // If it's a food question, or if it explicitly mentions meal times, it's an eating time question
  return isFoodQuestion || timePatterns.some(pattern => lowercasePrompt.includes(pattern));
}

// Check if the prompt is about image analysis or object recognition
function isImageAnalysisQuestion(prompt: string): boolean {
  const lowercasePrompt = prompt.toLowerCase();
  const imagePatterns = [
    'analyze this image',
    'analyze these images',
    'what is in this image',
    'what\'s in this image',
    'what\'s in these images',
    'identify this',
    'identify these',
    'recognize this',
    'extract text from',
    'ocr',
    'read text in',
    'detect objects',
    'what flower is this',
    'what plant is this',
    'what animal is this',
    'describe this image',
    'analyze photo',
    'analyze video',
    'what is in this video',
    'describe this video',
  ];
  
  return imagePatterns.some(pattern => lowercasePrompt.includes(pattern));
}

// Function to check if the prompt is about video analysis
function isVideoAnalysisQuestion(prompt: string): boolean {
  const lowercasePrompt = prompt.toLowerCase();
  const videoPatterns = [
    'analyze this video',
    'what is in this video',
    'what\'s in this video',
    'analyze video',
    'describe this video',
    'extract from video',
    'summarize video',
    'video content',
    'video analysis',
    'process video',
  ];
  
  return videoPatterns.some(pattern => lowercasePrompt.includes(pattern));
}

// Function to generate specialized image analysis prompt
function getImageAnalysisPrompt(prompt: string): string {
  const lowercasePrompt = prompt.toLowerCase();
  
  if (lowercasePrompt.includes('extract') && (lowercasePrompt.includes('text') || lowercasePrompt.includes('ocr'))) {
    return "Please extract and provide any text visible in the image. If there's no clear text, let me know.";
  } else if (lowercasePrompt.includes('flower') || lowercasePrompt.includes('plant')) {
    return "Please identify the plant or flower in this image. If possible, provide the scientific name, common characteristics, and any interesting facts about it.";
  } else if (lowercasePrompt.includes('animal') || lowercasePrompt.includes('pet')) {
    return "Please identify the animal in this image. If possible, provide the species, characteristics, and any interesting facts about it.";
  } else {
    return "Please analyze this image and describe what you see. Identify key objects, people, activities, context and any notable elements.";
  }
}

// Function to generate food recommendation based on time
function getFoodRecommendation(prompt: string): string {
  const lowercasePrompt = prompt.toLowerCase();
  
  if (lowercasePrompt.includes('breakfast') || lowercasePrompt.includes('morning')) {
    return "For breakfast, I would recommend something nutritious like oatmeal with fruits, eggs with whole grain toast, or a smoothie bowl. These options provide energy for the day ahead.";
  } else if (lowercasePrompt.includes('lunch') || lowercasePrompt.includes('afternoon')) {
    return "For lunch, balanced options include a hearty salad with protein, a grain bowl, or a sandwich with vegetables. These keep you energized through the afternoon.";
  } else if (lowercasePrompt.includes('dinner') || lowercasePrompt.includes('evening') || lowercasePrompt.includes('supper')) {
    return "For dinner, you might enjoy a balanced meal with protein, vegetables, and whole grains. Options like grilled fish with roasted vegetables, a vegetable stir-fry with tofu, or a hearty soup with crusty bread are nutritious choices.";
  } else if (lowercasePrompt.includes('snack') || lowercasePrompt.includes('between meals')) {
    return "For a snack, consider fruits, nuts, yogurt, or hummus with vegetables. These provide nutrients without excessive calories.";
  } else if (lowercasePrompt.includes('night') || lowercasePrompt.includes('midnight') || lowercasePrompt.includes('late')) {
    return "For late night eating, it's best to choose lighter options like herbal tea, a small piece of fruit, or a small portion of yogurt. Heavy meals late at night can disrupt sleep.";
  } else if (lowercasePrompt.includes('brunch')) {
    return "For brunch, popular options include avocado toast, eggs benedict, pancakes with fresh fruit, or a vegetable frittata. You can pair these with a refreshing beverage for a complete experience.";
  } else {
    return "I'd be happy to suggest meal ideas! For balanced nutrition, include protein, vegetables, whole grains, and healthy fats in your meals. Examples include grain bowls with vegetables and protein, hearty salads, or roasted vegetables with a protein source and whole grains.";
  }
}

// Function to handle speech recognition specific phrasings
function processSpeechInput(prompt: string): string {
  // Remove common speech recognition artifacts
  let processed = prompt.trim();
  
  // Remove filler words often added by speech recognition
  const fillerWords = [
    "umm", "uh", "like", "so", "just", "you know", "I mean", 
    "actually", "basically", "literally", "anyway", "well"
  ];
  
  fillerWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    processed = processed.replace(regex, '');
  });
  
  // Fix common speech recognition errors
  const corrections = [
    { from: "show me", to: "show me" },
    { from: "tell me", to: "tell me" },
    { from: "what's", to: "what is" },
    { from: "how's", to: "how is" },
    { from: "where's", to: "where is" },
    { from: "when's", to: "when is" },
    { from: "who's", to: "who is" },
    { from: "that's", to: "that is" },
    { from: "there's", to: "there is" },
    { from: "here's", to: "here is" },
    { from: "it's", to: "it is" },
  ];
  
  corrections.forEach(({ from, to }) => {
    const regex = new RegExp(`\\b${from}\\b`, 'gi');
    processed = processed.replace(regex, to);
  });
  
  // Clean up multiple spaces
  processed = processed.replace(/\s+/g, ' ').trim();
  
  return processed;
}

export const generateResponse = async (prompt: string, language: Language, files?: File[]): Promise<string> => {
  try {
    // Process speech input for better accuracy
    const processedPrompt = processSpeechInput(prompt);
    
    // Check if the prompt is asking about name or identity
    if (isNameRelatedQuestion(processedPrompt) && (!files || files.length === 0)) {
      if (language.code === 'en' || language.code === 'bn') {
        return `[DEVELOPER_PROFILE_START]Tasnim Mahmud[DEVELOPER_PROFILE_END]

I was created by **Tasnim Mahmud** — a developer and AI enthusiast from Bangladesh. He built MahmudGPT to make advanced AI accessible to everyone. You can reach him on WhatsApp: +8801782242874`;
      } else {
        // Let's use Gemini for translating the introduction
        const introPrompt = `Translate the following to ${language.name}: "I was created by Tasnim Mahmud — a developer and AI enthusiast from Bangladesh. He built MahmudGPT to make advanced AI accessible to everyone. You can reach him on WhatsApp: +8801782242874"`;
        const response = await fetchFromGemini(introPrompt);
        return response;
      }
    }
    
    // Check if the prompt is asking what the AI is doing
    if (isDoingQuestion(processedPrompt) && (!files || files.length === 0)) {
      if (language.code === 'en' || language.code === 'bn') {
        return language.code === 'en' 
          ? "I am doing well, thanks for asking!"
          : "আমি ভালো আছি, জিজ্ঞাসা করার জন্য ধন্যবাদ!";
      } else {
        // Let's use Gemini for translating the response
        const doingPrompt = `Translate the following to ${language.name}: "I am doing well, thanks for asking!"`;
        const response = await fetchFromGemini(doingPrompt);
        return response;
      }
    }
    
    // Check if the prompt is about food or meal times
    if (isEatingTimeQuestion(processedPrompt) && (!files || files.length === 0)) {
      const recommendation = getFoodRecommendation(processedPrompt);
      if (language.code === 'en' || language.code === 'bn') {
        if (language.code === 'bn') {
          // Translate the food recommendation to Bengali
          const foodPrompt = `Translate the following to Bengali: "${recommendation}"`;
          const response = await fetchFromGemini(foodPrompt);
          return response;
        }
        return recommendation;
      } else {
        // Translate the food recommendation
        const foodPrompt = `Translate the following to ${language.name}: "${recommendation}"`;
        const response = await fetchFromGemini(foodPrompt);
        return response;
      }
    }
    
    // If there are media files, process them
    if (files && files.length > 0) {
      // Check if it's a video file
      const videoFile = files.find(file => file.type.startsWith('video/'));
      if (videoFile) {
        return await processVideoWithGemini(processedPrompt, videoFile);
      }
      
      // If multiple images, process them all
      if (files.length > 1) {
        return await processMultipleImagesWithGemini(processedPrompt, files.slice(0, 20)); // Limit to 20 images
      } else {
        // Single image processing
        return await processImageWithGemini(processedPrompt, files[0]);
      }
    }
    
    // Check if the prompt is about image or video analysis but no media is provided
    if ((isImageAnalysisQuestion(processedPrompt) || isVideoAnalysisQuestion(processedPrompt)) && (!files || files.length === 0)) {
      const analysisPrompt = getImageAnalysisPrompt(processedPrompt);
      let responseMessage = "";
      
      if (isVideoAnalysisQuestion(processedPrompt)) {
        if (language.code === 'en' || language.code === 'bn') {
          responseMessage = language.code === 'en' 
            ? "I'd be happy to analyze that video for you! Please upload a video file (maximum 2 minutes) that you'd like me to analyze."
            : "আমি আপনার জন্য সেই ভিডিওটি বিশ্লেষণ করতে খুশি হব! দয়া করে একটি ভিডিও ফাইল আপলোড করুন (সর্বাধিক ২ মিনিট) যা আপনি আমাকে বিশ্লেষণ করতে চান।";
        } else {
          const translatedPrompt = `Translate the following to ${language.name}: "I'd be happy to analyze that video for you! Please upload a video file (maximum 2 minutes) that you'd like me to analyze."`;
          responseMessage = await fetchFromGemini(translatedPrompt);
        }
      } else {
        if (language.code === 'en' || language.code === 'bn') {
          responseMessage = language.code === 'en' 
            ? `I'd be happy to analyze those images for you! ${analysisPrompt} Please upload up to 20 images you'd like me to analyze.`
            : `আমি আপনার জন্য সেই ছবিগুলি বিশ্লেষণ করতে খুশি হব! দয়া করে সর্বাধিক ২০টি ছবি আপলোড করুন যা আপনি আমাকে বিশ্লেষণ করতে চান।`;
        } else {
          const translatedPrompt = `Translate the following to ${language.name}: "I'd be happy to analyze those images for you! ${analysisPrompt} Please upload up to 20 images you'd like me to analyze."`;
          responseMessage = await fetchFromGemini(translatedPrompt);
        }
      }
      
      return responseMessage;
    }
    
    // If it's a regular prompt in Bengali, translate the response back to Bengali
    if (language.code === 'bn') {
      const englishResponse = await fetchFromGemini(processedPrompt);
      const bengaliPrompt = `Translate the following to Bengali: "${englishResponse}"`;
      return await fetchFromGemini(bengaliPrompt);
    }
    
    // If it's a regular prompt, use the processed version for better accuracy
    return await fetchFromGemini(processedPrompt);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
}

async function processImageWithGemini(prompt: string, imageFile: File): Promise<string> {
  try {
    // Convert the image File to base64
    const base64Image = await convertFileToBase64(imageFile);
    
    // Create appropriate analysis prompt based on user input or default
    let imageAnalysisPrompt = prompt;
    if (!prompt || prompt === `Analyzing image: ${imageFile.name}`) {
      if (imageFile.name.toLowerCase().includes("flower") || 
          imageFile.name.toLowerCase().includes("plant") || 
          imageFile.name.toLowerCase().includes("rose") || 
          imageFile.name.toLowerCase().includes("tulip")) {
        imageAnalysisPrompt = "Please identify and describe this flower or plant in detail. Include the species if possible, color, characteristics, and any interesting facts about it.";
      } else if (imageFile.name.toLowerCase().includes("animal") || 
                imageFile.name.toLowerCase().includes("pet") || 
                imageFile.name.toLowerCase().includes("dog") || 
                imageFile.name.toLowerCase().includes("cat")) {
        imageAnalysisPrompt = "Please identify and describe this animal in detail. Include the species or breed if possible, characteristics, and any interesting facts about it.";
      } else {
        imageAnalysisPrompt = "Please provide a detailed description of this image. Describe what you see, including objects, people, colors, setting, and any notable elements.";
      }
    }
    
    // Construct the request body with multipart content (text + image)
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: imageAnalysisPrompt
            },
            {
              inline_data: {
                mime_type: imageFile.type,
                data: base64Image
              }
            }
          ]
        }
      ]
    };
    
    // Make the API call
    const response = await fetch(`${API_URL}?key=${apiService.apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} ${error}`);
    }
    
    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts) {
      throw new Error('No response from Gemini API for image analysis');
    }
    
    // Extract the response text
    const responseText = data.candidates[0].content.parts[0].text;
    
    // Check if the response is just bounding box JSON
    if (responseText.includes('bounding box') || 
        (responseText.trim().startsWith('```json') && responseText.includes('box_2d'))) {
      // Process the bounding box information into a more useful description
      const match = responseText.match(/\[\s*{\s*"box_2d":\s*\[\s*\d+,\s*\d+,\s*\d+,\s*\d+\s*\],\s*"label":\s*"([^"]+)"\s*}\s*\]/);
      
      if (match && match[1]) {
        const detectedObject = match[1];
        
        if (detectedObject.toLowerCase().includes("flower") || 
            detectedObject.toLowerCase().includes("rose") || 
            detectedObject.toLowerCase().includes("tulip") || 
            detectedObject.toLowerCase().includes("plant")) {
          
          // For flowers, generate a more descriptive response
          return `I've analyzed your image and identified it as a ${detectedObject}. 
          
This appears to be a beautiful specimen with vibrant colors. ${detectedObject.toLowerCase().includes("rose") ? "Roses are known for their elegant petals and are often associated with love and affection. They come in various colors, each with its own symbolism." : ""}
          
${detectedObject.toLowerCase().includes("tulip") ? "Tulips are known for their perfect, symmetrical cup-shaped blooms and are associated with spring. They're native to Central Asia but became famously popular in the Netherlands." : ""}

Would you like to know more specific information about this type of flower?`;
        } else {
          // For other objects
          return `I've analyzed your image and identified it as a ${detectedObject}. The object is clearly visible in the image. Would you like more specific information about what I can see in this image?`;
        }
      } else {
        // If we can't extract the label, request a better description
        return await fetchFromGemini(`Please provide a more detailed and descriptive analysis of this image that appears to contain a ${imageFile.name.split('.')[0].replace(/[^a-zA-Z0-9\s]/g, ' ')}. Describe its appearance, colors, and any notable features.`);
      }
    }
    
    return responseText;
  } catch (error) {
    console.error("Error processing image with Gemini:", error);
    return "I encountered an error analyzing this image. This could be due to image format limitations or content restrictions. Please try with a different image or a clearer description.";
  }
}

async function processMultipleImagesWithGemini(prompt: string, imageFiles: File[]): Promise<string> {
  try {
    // For multiple images, we'll analyze each one and combine the results
    const results = await Promise.all(
      imageFiles.map(async (file, index) => {
        try {
          const individualPrompt = `${prompt} (Image ${index + 1} of ${imageFiles.length}: ${file.name})`;
          const result = await processImageWithGemini(individualPrompt, file);
          return `**Image ${index + 1} (${file.name})**: ${result}`;
        } catch (error) {
          console.error(`Error processing image ${index + 1}:`, error);
          return `**Image ${index + 1} (${file.name})**: Error analyzing this image.`;
        }
      })
    );
    
    // Combine all results with a summary
    const combinedResults = results.join("\n\n");
    
    // Generate a summary for all images
    const summaryPrompt = `I've analyzed ${imageFiles.length} images. Here's a brief summary of what I found:\n\n${combinedResults}\n\nCan you provide a concise summary that highlights common elements or themes across these images?`;
    
    try {
      const summary = await fetchFromGemini(summaryPrompt);
      return `# Analysis of ${imageFiles.length} Images\n\n${combinedResults}\n\n## Summary\n\n${summary}`;
    } catch (error) {
      console.error("Error generating summary:", error);
      return combinedResults;
    }
  } catch (error) {
    console.error("Error processing multiple images with Gemini:", error);
    return "I encountered an error analyzing these images. This could be due to format limitations or content restrictions.";
  }
}

async function processVideoWithGemini(prompt: string, videoFile: File): Promise<string> {
  try {
    // Check if the video is too long (over 2 minutes)
    const videoDuration = await getVideoDuration(videoFile);
    const MAX_DURATION_SECONDS = 120; // 2 minutes
    
    if (videoDuration > MAX_DURATION_SECONDS) {
      return `This video is ${Math.round(videoDuration)} seconds long, which exceeds the 2-minute (120 seconds) limit. Please upload a shorter video or trim this one to analyze it.`;
    }
    
    // Extract frames from the video at regular intervals
    const frames = await extractVideoFrames(videoFile, 5); // Extract 5 frames
    
    if (frames.length === 0) {
      return "I couldn't extract any frames from this video. The file might be corrupted or in an unsupported format.";
    }
    
    // Analyze each frame
    const frameResults = await Promise.all(
      frames.map(async (frame, index) => {
        const frameBlob = await fetch(frame).then(r => r.blob());
        const frameFile = new File([frameBlob], `frame-${index}.jpg`, { type: 'image/jpeg' });
        const framePrompt = `Analyze this frame from the video at approximately ${Math.round((index / (frames.length - 1)) * videoDuration)} seconds`;
        return processImageWithGemini(framePrompt, frameFile);
      })
    );
    
    // Generate a summary of the video based on frame analyses
    const videoSummaryPrompt = `
I have analyzed ${frames.length} frames from a ${Math.round(videoDuration)} second video. 
The frames were taken at the following timestamps: ${frames.map((_, i) => Math.round((i / (frames.length - 1)) * videoDuration) + "s").join(", ")}.
Here's what I found in each frame:

${frameResults.map((result, i) => `Frame at ~${Math.round((i / (frames.length - 1)) * videoDuration)}s: ${result}`).join("\n\n")}

Based on this analysis, please provide:
1. A comprehensive summary of what happens in the video
2. Any notable changes or movements throughout the video
3. The main subjects/objects in the video and their actions
`;

    const videoSummary = await fetchFromGemini(videoSummaryPrompt);
    
    return `# Video Analysis (${Math.round(videoDuration)} seconds)\n\n${videoSummary}`;
  } catch (error) {
    console.error("Error processing video with Gemini:", error);
    return "I encountered an error analyzing this video. This could be due to format limitations, file size, or content restrictions. Please try with a different video or a clearer description.";
  }
}

async function getVideoDuration(videoFile: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    
    videoElement.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoElement.src);
      resolve(videoElement.duration);
    };
    
    videoElement.onerror = () => {
      reject(new Error("Failed to load video metadata"));
    };
    
    videoElement.src = URL.createObjectURL(videoFile);
  });
}

async function extractVideoFrames(videoFile: File, frameCount: number): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const frames: string[] = [];
    
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      video.currentTime = 0;
    };
    
    video.onseeked = () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL('image/jpeg'));
        
        if (frames.length < frameCount && video.currentTime < video.duration) {
          // Move to the next interval
          video.currentTime = video.duration * (frames.length / frameCount);
        } else {
          // We've extracted all frames
          window.URL.revokeObjectURL(video.src);
          resolve(frames);
        }
      }
    };
    
    video.onerror = () => {
      reject(new Error("Failed to load video"));
    };
    
    video.src = URL.createObjectURL(videoFile);
    video.load();
  });
}

// Helper function to convert a File to base64 string
function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      base64String = base64String.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
}

async function fetchFromGemini(prompt: string): Promise<string> {
  const response = await fetch(`${API_URL}?key=${apiService.apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${response.status} ${error}`);
  }

  const data: GeminiResponse = await response.json();
  
  if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts) {
    throw new Error('No response from Gemini API');
  }
  
  return data.candidates[0].content.parts[0].text;
}
