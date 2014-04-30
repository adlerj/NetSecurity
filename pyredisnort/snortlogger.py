"""Module snortlogger

Parses snort log files and stores results into Python objects.
"""



class SnortLog:
    def __init__(self,host,ip,requesttype):
        self.host = host
        self.ip = ip
        self.request = requesttype