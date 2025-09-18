class PumpingStationConnectionError (Exception):

    def __init__(self, message, host=None, port=None):
        self.message = message
        self.host = host
        self.port = port
        super().__init__(self.message)