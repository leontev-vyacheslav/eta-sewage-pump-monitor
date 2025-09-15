from datetime import datetime, timezone
from threading import Thread


class AppBackgroundThreadModel:

    def __init__(self, name: str, thread: Thread, data: dict) -> None:
        self.name = name
        self.thread = thread
        self.creation_date = datetime.now(timezone.utc)
        self.data = data,
