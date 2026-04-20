import os
import logging
import requests

logger = logging.getLogger(__name__)

# Ollama instance is accessible via the docker network hostname 'ollama'
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://ollama:11434/api/chat")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

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
    """
    Calls the local Ollama instance to get a chat response.
    History mapping is done to match Ollama's API expectations.
    """
    try:
        # Map history to Ollama's format (though frontend currently passes empty history)
        # Assuming history is a list of dicts with 'role' and 'parts'/'content' if implemented
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        
        # In this implementation, the frontend sends a single message string.
        # We append the current user message to the messages array.
        messages.append({"role": "user", "content": message})

        payload = {
            "model": OLLAMA_MODEL,
            "messages": messages,
            "stream": False
        }

        logger.info(f"Sending request to Ollama ({OLLAMA_MODEL}) at {OLLAMA_URL}")
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            return result.get("message", {}).get("content", "Sorry, I received an empty response.")
        else:
            logger.error(f"Ollama error {response.status_code}: {response.text}")
            raise RuntimeError(f"Ollama API returned status {response.status_code}")

    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to connect to Ollama: {e}")
        raise RuntimeError(
            "Chatbot is currently offline. The local AI model (Ollama) is unreachable."
        )
    except Exception as e:
        logger.error(f"Chatbot error: {e}")
        raise
