import os
import google.generativeai as genai
from typing import Dict, Any

class GeminiService:
    def __init__(self):
        # Configure Gemini API
        api_key = os.environ.get("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
        else:
            print("WARNING: GEMINI_API_KEY environment variable not set.")
            
        # Standard system instructions for the election assistant
        self.system_instruction = """
        You are a helpful, neutral, and informative Election Assistant. Your goal is to help users understand the election process, timelines, and steps in an interactive and easy-to-follow way.
        
        Guidelines:
        1. Provide factual, unbiased information about elections (general processes, voter registration, EVM workings, candidate eligibility, etc.).
        2. Do not show bias towards any political party, candidate, or ideology.
        3. Keep answers concise, clear, and easy to understand for the general public.
        4. If a user asks a question outside the scope of elections, politely decline to answer and guide them back to election-related topics.
        5. Format your responses using markdown where appropriate (bullet points, bold text for emphasis) to make it readable.
        """
        
        try:
            # Using Gemini 1.5 Pro or Flash depending on availability/need. Flash is faster for chat.
            self.model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=self.system_instruction
            )
        except Exception as e:
            print(f"Error initializing Gemini model: {e}")
            self.model = None

    def get_response(self, prompt: str) -> str:
        """
        Send a prompt to the Gemini API and return the text response.
        """
        if not self.model:
            return "Error: Gemini model is not properly initialized."
            
        try:
            # We start a chat session or just generate content. For a simple QA, generate_content is fine.
            # If we wanted to keep history, we'd use start_chat().
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            return "I apologize, but I encountered an error while processing your request. Please try again later."
