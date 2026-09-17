import os
from pathlib import Path

from dotenv import load_dotenv
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient

load_dotenv()

endpoint = os.getenv("AZURE_SEARCH_ENDPOINT")
api_key = os.getenv("AZURE_SEARCH_ADMIN_KEY_PRIMARY")
index_name = os.getenv("AZURE_SEARCH_INDEX")

knowledge_folder = (
    Path(__file__).resolve().parents[2]
    / "data"
    / "knowledge"
)

credential = AzureKeyCredential(api_key)

search_client = SearchClient(
    endpoint=endpoint,
    index_name=index_name,
    credential=credential
)

documents = []

for file_path in knowledge_folder.glob("*.md"):

    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()

    documents.append({
        "id": file_path.stem,
        "content": content,
        "file_name": file_path.name
    })

if not documents:
    print("No knowledge documents found.")
else:
    result = search_client.upload_documents(documents=documents)

    print("Knowledge upload completed.")

    for item in result:
        print(item)