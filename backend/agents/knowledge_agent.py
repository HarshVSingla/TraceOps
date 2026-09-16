from pathlib import Path


class KnowledgeAgent:

    def __init__(self, knowledge_folder):
        self.knowledge_folder = Path(knowledge_folder)

    def search(self, keyword):

        if not self.knowledge_folder.exists():
            return {
                "status": "error",
                "message": "Knowledge folder not found"
            }

        results = []

        for file in self.knowledge_folder.glob("*.md"):

            with open(file, "r", encoding="utf-8") as f:
                content = f.read()

            if keyword.lower() in content.lower():
                results.append({
                    "file": file.name,
                    "content": content
                })

        return {
            "status": "success",
            "keyword": keyword,
            "matches": results
        }


if __name__ == "__main__":

    knowledge_path = (
        Path(__file__).resolve().parents[2]
        / "data"
        / "knowledge"
    )

    agent = KnowledgeAgent(knowledge_path)

    result = agent.search("database connection")

    print(result)