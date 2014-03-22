#!/usr/bin/env/ python

"""Spammer.py: a utility for 'attacking' a server with junk.

This module is intended to be used both as a base script which could be useful
both for testing the robustness of our server tooling, as well as for
developing other scripts for the same purpose. The essential idea is to start
up a few processes and start writing junk values over to the target server 
over various ports.
"""

import httplib
import random
import sys
import telnetlib

__author__ = "Jeff Rabinowitz"
__version__ = "0.0.1"
__status__ = "Prototype"


def junkString():
    """Returns a random string in hexadecimal"""
    return "{:30x}".format(random.randrange(16**30))

class Spammer(object):
    """An abstract spammer class."""
    def spam(self):
        raise NotImplementedError("This should be implemented!")

class TelnetSpammer(Spammer):
    """A spammer module for spamming over Telnet."""
    def __init__(self):
        self._client = telnetlib.Telnet()

    def spam(self,host,port):
        for x in range(0,100):
            self._client.open(host,port)
            self._client.write(junkString())
            self._client.close()


class HttpSpammer(Spammer):
    """Spam over HTTP"""
    def spam(self,host):
        h = httplib.HTTPConnection(host)
        for x in range(0,100):
            h.request("GET","/")
            r = h.getresponse()
            r.read()

def main():
    h = HttpSpammer()
    h.spam("scarletshield.rutgers.edu")

if __name__ == "__main__":
    main()