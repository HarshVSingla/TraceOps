import os

from dotenv import load_dotenv
from azure.core.credentials import AzureKeyCredential
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (
    SearchIndex,
    SearchField,
    SearchFieldDataType,
    SimpleField,
)

load_dotenv()

endpoint = os.getenv("AZURE_SEARCH_ENDPOINT")
api_key = os.getenv("AZURE_SEARCH_ADMIN_KEY_PRIMARY")
index_name = os.getenv("AZURE_SEARCH_INDEX")

credential = AzureKeyCredential(api_key)

index_client = SearchIndexClient(
    endpoint=endpoint,
    credential=credential
)

fields = [
    SimpleField(
        name="id",
        type=SearchFieldDataType.String,
        key=True
    ),
    SearchField(
        name="content",
        type=SearchFieldDataType.String,
        searchable=True
    ),
    SimpleField(
        name="file_name",
        type=SearchFieldDataType.String,
        filterable=True
    )
]

index = SearchIndex(
    name=index_name,
    fields=fields
)

result = index_client.create_or_update_index(index)

print(f"Search index created: {result.name}")