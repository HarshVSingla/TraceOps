import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

endpoint = os.getenv("FOUNDRY_PROJECT_ENDPOINT")
api_key = os.getenv("FOUNDRY_API_KEY")

client = OpenAI(
    api_key=api_key,
    base_url=endpoint.rstrip("/") + "/openai/v1"
)

def ask_gpt(prompt):
    response = client.responses.create(
        model=os.getenv("AZURE_OPENAI_DEPLOYMENT"),
        input=prompt
    )

    return response.output_text