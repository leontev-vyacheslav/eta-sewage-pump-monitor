from typing import Dict
from threading import Lock as ThreadLock

worker_thread_locks: Dict[str, ThreadLock] = {}
