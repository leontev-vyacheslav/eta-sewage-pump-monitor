import glob
import importlib
import os
from threading import Lock, Thread
from typing import List, Optional

from lockers import worker_thread_locks
import workers
from flask_ex import FlaskEx
from models.common.app_background_thread_model import AppBackgroundThreadModel


class WorkerStarter():

    def __init__(self, app: Optional[FlaskEx] = None, **kwargs):
        self._options = kwargs

        if app is not None:
            self.init_app(app)

    @staticmethod
    def run(app: FlaskEx, worker_files: List[str]):

        for worker_path in worker_files:
            worker_module_name, _ = os.path.splitext(os.path.basename(worker_path))
            worker_module = importlib.import_module(f'.{worker_module_name}', workers.__name__)

            for worker_info in app.internal_settings.workers:

                if hasattr(worker_module, worker_info.name):
                    worker = getattr(worker_module, worker_info.name)
                    lock = Lock()
                    worker_thread_locks[f'{worker_info.name}_lock'] = lock

                    thread = Thread(
                        target=worker,
                        args=(app, worker_info.interval, worker_info.immediately, lock),
                        daemon=True
                    )
                    thread.start()

                    app.app_background_threads.append(AppBackgroundThreadModel(
                        name=worker_info.name,
                        thread=thread,
                        data={}
                    ))

    def init_app(self, app: FlaskEx):

        worker_files = glob.glob(
            str(app.app_root_path.joinpath(f'src/{workers.__name__}/*.py'))
        )

        WorkerStarter.run(app, worker_files)
