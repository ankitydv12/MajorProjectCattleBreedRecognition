import google.generativeai as genai
import os
import logging

logger = logging.getLogger(__name__)

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# Try models in order of preference
_MODEL_CANDIDATES = [
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-2.0-flash",
]

def _get_model():
    """Find the first available Gemini model."""
    for model_name in _MODEL_CANDIDATES:
        try:
            m = genai.GenerativeModel(model_name)
            # Quick probe to validate the model is accessible
            m.count_tokens("test")
            logger.info(f"Using Gemini model: {model_name}")
            return m
        except Exception as e:
            logger.warning(f"Model {model_name} not available: {e}")
    raise RuntimeError(
        "No Gemini model is available. Check your GEMINI_API_KEY and network access."
    )

try:
    _model = _get_model()
except Exception as e:
    logger.error(f"Chatbot initialization failed: {e}")
    _model = None

SYSTEM_PROMPT = """You are CattleAI Assistant, an expert on Indian 
indigenous cattle and buffalo breeds. You help farmers with breed 
identification, diet, diseases, and management tips for these 26 breeds:
Gir, Sahiwal, Tharparkar, Rathi, Kankrej, Deoni, Hallikar, Amritmahal,
Kangayam, Alambadi, Bargur, Pulikulam, Dangi, Nimari, Nagori, Kherigarh,
Kenkatha, Kasaragod, Malnad Gidda, Umblachery, Banni, Jaffrabadi, 
Mehsana, Nagpuri, Nili Ravi, Shurti.
Always recommend consulting a vet for medical issues.
Keep responses concise and farmer-friendly."""

def get_chat_response(message: str, history: list = []):
    if _model is None:
        raise RuntimeError(
            "Chatbot is not available. No Gemini model could be loaded. "
            "Check that GEMINI_API_KEY is set and valid."
        )
    try:
        chat = _model.start_chat(history=[])
        full_message = SYSTEM_PROMPT + "\n\nUser: " + message
        response = chat.send_message(full_message)
        return response.text
    except Exception as e:
        logger.error(f"Chatbot error: {e}")
        raise  # Let the route handler return a proper 500 with detail
