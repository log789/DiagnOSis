import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface PatientData {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    oxygen: number;
    temperature: number;
  };
  lifestyle: {
    sleepHours: number;
    steps: number;
    nutritionScore: number; // 0-100
    medicationAdherence: number; // 0-100
  };
  cognitive: {
    memoryScore: number; // 0-100
    attentionScore: number; // 0-100
    reactionTime: number; // ms
    gameHistory: { date: string; score: number; level: number }[];
  };
  emotional: {
    mood: 'Happy' | 'Neutral' | 'Sad' | 'Anxious' | 'Calm' | 'Energetic';
    stressLevel: number; // 0-100
    journalEntries: { date: string; text: string; sentiment: string }[];
  };
  medications: string[];
  medicationSchedule: MedicationReminder[];
  diagnoses: string[];
  labs: { [key: string]: string | number };
}

export interface MedicationReminder {
  id: string;
  name: string;
  dosage: string;
  time: string; // HH:mm
  status: 'taken' | 'missed' | 'pending';
  date: string; // YYYY-MM-DD
}

export interface SimulationResult {
  prediction: string;
  confidence: number;
  chartData: { time: string; value: number; label: string }[];
  recommendations: string[];
}

export const geminiService = {
  async generateDigitalTwinSummary(patient: PatientData) {
    const prompt = `
      As a clinical AI assistant, provide a concise medical summary for the following patient digital twin.
      Focus on key risks, current stability, and immediate concerns.
      
      Patient: ${patient.firstName} ${patient.lastName}, ${patient.dob}, ${patient.gender}
      Vitals: HR ${patient.vitals.heartRate}, BP ${patient.vitals.bloodPressure}, O2 ${patient.vitals.oxygen}%
      Diagnoses: ${patient.diagnoses.join(', ')}
      Medications: ${patient.medications.join(', ')}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional medical architect. Be precise, clinical, and objective. Never claim absolute certainty."
      }
    });

    return response.text;
  },

  async runSimulation(patient: PatientData, scenario: string): Promise<SimulationResult> {
    const prompt = `
      Run a health trajectory simulation for this patient digital twin under the following scenario: "${scenario}"
      
      Patient Data: ${JSON.stringify(patient)}
      
      Predict the outcome over the next 6 months.
      Provide structured data including a prediction summary, confidence level, and trend data for a risk score (0-100).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a clinical predictive modeling engine. Return valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prediction: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            chartData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  value: { type: Type.NUMBER },
                  label: { type: Type.STRING }
                }
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["prediction", "confidence", "chartData", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text);
  },

  async chatWithTwin(patient: PatientData, query: string, history: { role: 'user' | 'model', text: string }[]) {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `
          You are the DiagnOSis Clinical Assistant. You have access to the patient's digital twin data.
          Current Patient: ${JSON.stringify(patient)}
          
          Guidelines:
          1. Separate observation (data) from inference (AI prediction).
          2. Clearly state if data is missing.
          3. Never give definitive medical advice; provide clinical insights for professional review.
          4. Use professional, supportive language.
        `
      }
    });

    const response = await chat.sendMessage({
      message: query
    });

    return response.text;
  }
};
