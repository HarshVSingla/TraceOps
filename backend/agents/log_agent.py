from pathlib import Path


class LogAgent:

    def __init__(self, log_file):
        self.log_file = Path(log_file)

    def analyze(self):
        if not self.log_file.exists():
            return {
                "status": "error",
                "message": "Log file not found"
            }

        with open(self.log_file, "r") as file:
            logs = file.readlines()

        errors = []

        for log in logs:
            if "ERROR" in log:
                errors.append(log.strip())

        return {
            "status": "success",
            "total_logs": len(logs),
            "error_count": len(errors),
            "errors": errors
        }


if __name__ == "__main__":

    log_path = Path(__file__).resolve().parents[2] / "data" / "logs" / "api.log"

    agent = LogAgent(log_path)

    result = agent.analyze()

    print(result)