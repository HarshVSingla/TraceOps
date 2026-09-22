

class LogAgent:

    def __init__(self, runtime_logs):
        self.runtime_logs = runtime_logs

    def analyze(self):

        if not self.runtime_logs:
            return {
                "status": "error",
                "message": "No runtime logs provided"
            }

        errors = []

        for log in self.runtime_logs:

            if log.get("level") == "ERROR":
                errors.append(log)

        return {
            "status": "success",
            "total_logs": len(self.runtime_logs),
            "error_count": len(errors),
            "errors": errors
        }


if __name__ == "__main__":

    log_path = Path(__file__).resolve().parents[2] / "data" / "logs" / "api.log"

    agent = LogAgent(log_path)

    result = agent.analyze()

    print(result)