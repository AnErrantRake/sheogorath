import os, time

# string output, pipe to store
# outputs '|' delimited strings
# enumerates a file structure for 'dir'
# created time might not provide expected result on Unix

dir = "path/to/dir"

def list_files(inpath):
    print("FileName|CurrentPath|Created|LastTouched|Category|Summary")
    for root, drop, filenames in os.walk(inpath):
        abspath = os.path.abspath(root)
        for filename in filenames:
            created = time.asctime(time.localtime(os.path.getctime(os.path.join(root, filename))))
            modified = time.asctime(time.localtime(os.path.getmtime(os.path.join(root, filename))))
            print("%s|%s|%s|%s|%s|%s" % (filename, abspath,created,modified,abspath," "))

list_files(dir)
