import os

from dotenv import load_dotenv
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient


class KnowledgeAgent:

    def __init__(self):
        load_dotenv()

        endpoint = os.getenv("AZURE_SEARCH_ENDPOINT")
        api_key = os.getenv("AZURE_SEARCH_ADMIN_KEY_PRIMARY")
        index_name = os.getenv("AZURE_SEARCH_INDEX")

        credential = AzureKeyCredential(api_key)

        self.search_client = SearchClient(
            endpoint=endpoint,
            index_name=index_name,
            credential=credential
        )

    def search(self, query):

        results = self.search_client.search(
            search_text=query,
            top=5
        )

        matches = []

        for result in results:
            matches.append({
                "file_name": result["file_name"],
                "content": result["content"]
            })

        return {
            "status": "success",
            "query": query,
            "matches": matches
        }


if __name__ == "__main__":

    agent = KnowledgeAgent()

    result = agent.search("database connection timeout")

    print("\n===== TRACEOPS AZURE AI SEARCH =====")

    print("\nQuery:")
    print(result["query"])

    print("\nMatches:")

    for match in result["matches"]:
        print("\nFile:", match["file_name"])
        print(match["content"])