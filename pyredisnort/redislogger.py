"""Module redislogger

This module defines conventions used for logging analyzed web traffic to redis.
"""

import redis
from snortlogger import SnortLog

class RedisLogger:
    """A class which transacts against a Redis instance.

    This class also knows what format Redis requires to 
    store its nested data, and performs the conversions
    implicitly.
    """
    def __init__(self,host='localhost',port=6379,db=0):
        self._r = redis.StrictRedis(host, port, db)

    def putLogList(self, snortLog):
        """Given a list of SnortLogs, put the log into Redis"""
        pass

    def putLogs(self, *snortLogs):
        """Log an arbitrary number of snortLogs"""
        for log in snortLogs:
            pass