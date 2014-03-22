import os
import sys
import re
import argparse
 
latexlogexts = ['.toc','.bbl','.aux','.gz','.blg','.dvi','.log','.out','.bcf','.run.xml']

def create_regex(extlist):
    filtlist = [exp for exp in extlist if exp in latexlogexts]
    if not filtlist:
        raise TypeError('An extension was invalid!')
    else:
        # inner = "|".join(filtlist)
        # regex = '\w+\.(' + inner + ')$'
        return filtlist
    
class Remover:
    """A class to encapsulate removing functionality"""
    def __init__(self,exts,dir,recursive):
        self.exts = exts
        self.dir = os.path.abspath(dir)
        self.recursive = recursive
    def printmsg(self):
        print("Removing LaTeX intermediate and log files from:")
        print(self.dir)
    def remove(self):
        self.printmsg()
        if self.recursive == True:
            self.remove_recursive()
        else:
            self.remove_nonrec(self.dir)
    def remove_recursive(self):
        for root, dirs, files in os.walk(self.dir):
            self.remove_nonrec(root)
    def remove_nonrec(self,path):
        contents = os.listdir(path)
        for content in contents:
            if any(content.lower().endswith(ext) for ext in exts):
                target = os.path.join(path,content)
                os.remove(target)
                print('%(file)s removed!' % {'file':target})
            # result = re.search(self.regex,content)
            # if result:
            #     target = os.path.join(path,content)
            #     os.remove(target)
            #     print('%(file)s removed!' % {'file':target})
 
def main(exts,dirs,recursive):
    for dir in dirs:
        rm = Remover(exts,dir,recursive)
        rm.remove()
    print("Done!")
    
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description = "Cleans up LaTeX log files")
    parser.add_argument('dirs', nargs='*', default='.', help='directories to remove from (default: current)')
    parser.add_argument('-r','--recursive',action='store_false',help='remove recursively from directories')
    parser.add_argument('-e','--extensions', nargs='*',default=latexlogexts,
        help='specify file extensions to remove (default: LaTeX log files)')
    args=parser.parse_args()
    exts = create_regex(args.extensions)
    main(exts,args.dirs,args.recursive)