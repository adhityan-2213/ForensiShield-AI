import re
from pathlib import Path


def parse_log_file(file_path):
    
    """Read a text-based log file and return its lines."""
    

    path = Path(file_path)

    if not path.is_file():
        raise FileNotFoundError("Log file not found.")

    log_entries = []

    with path.open("r", encoding="utf-8", errors="replace") as log_file:
        for line_number, line in enumerate(log_file, start=1):
            cleaned_line = line.strip()

            if cleaned_line:
                log_entries.append(
                    {
                        "line_number": line_number,
                        "message": cleaned_line,
                    }
                )

    return log_entries

def detect_failed_logins(log_entries):
    
    """Identify log entries that indicate failed login attempts."""

    suspicious_events = []

    failed_login_patterns = [
        "failed login",
        "login failed",
        "authentication failed",
        "invalid password",
        "unauthorized login",
    ]

    for entry in log_entries:
        message = entry["message"]

        matched_pattern = next(
            (
                pattern
                for pattern in failed_login_patterns
                if pattern in message.casefold()
            ),
            None,
        )

        if matched_pattern:
            suspicious_events.append(
                {
                    "line_number": entry["line_number"],
                    "event_type": "FAILED_LOGIN",
                    "severity": "MEDIUM",
                    "matched_pattern": matched_pattern,
                    "message": message,
                }
            )

    return suspicious_events
def detect_repeated_failures(suspicious_events, threshold=3):
    """Flag possible repeated login failures.

    This version counts failed-login events in the supplied list.
    It does not yet group events by IP address or time window."""

    failed_count = len(
        [
            event
            for event in suspicious_events
            if event["event_type"] == "FAILED_LOGIN"
        ]
    )

    if failed_count >= threshold:
        return {
            "event_type": "POSSIBLE_BRUTE_FORCE",
            "severity": "HIGH",
            "failed_attempts": failed_count,
            "message": (
                f"{failed_count} failed login events detected. "
                "Investigate the source and timestamps."
            ),
        }

    return None