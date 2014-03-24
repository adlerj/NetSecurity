#!/usr/bin/env python
"""A python script for dumping the output of a MySQL database to a file.

This python script should be called one or more times a day (depending on load)
to back up the table(s) of a MySQL dataase. 
"""
import ConfigParser
import os
import time
import subprocess
import gzip
 

def main():
    config = ConfigParser.ConfigParser()
    config.read('mysqldump.cfg')

    # data is in plaintext, eventually this should be secured
    user = config.get('MySQL Dump Settings','user')
    password = config.get('MySQL Dump Settings','password')
    database = config.get('MySQL Dump Settings','database')
    table = config.get('MySQL Dump Settings','table')
    host = config.get('MySQL Dump Settings','host')
    directory = config.get('MySQL Dump Settings','directory')

    # Start a new process and read the results 
    # see http://stackoverflow.com/a/5658303/1993865
    csvdump = subprocess.check_output(["mysqldump", "-"+user,
        "-p"+password, "-h"+host, "-T"+directory,
        database, table, "--where=id<100000", "--fields-terminated-by=,"])
    
    filestamp = time.strftime('%Y-%m-%d-%I:%M')
    f = gzip.open(filestamp+".csv.gz",'w')
    f.write(csvdump)
    f.close()
 
if __name__=="__main__":
    main()