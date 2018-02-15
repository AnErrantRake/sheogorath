import os, time

# string output, pipe to store

# intended for tracking contents of large/complicated file structures
# enumerates a file structure for 'dir' in csv format
# created time might not provide expected result on Unix

dir = "path/to/dir"
delim = "|"

def list_files(inpath):
    print("FileName%sCurrentPath%sCreated%sLastTouched%sCategory%sSummary" % (delim,delim,delim,delim,delim)
    for root, drop, filenames in os.walk(inpath):
        abspath = os.path.abspath(root)
        for filename in filenames:
            created = time.asctime(time.localtime(os.path.getctime(os.path.join(root, filename))))
            modified = time.asctime(time.localtime(os.path.getmtime(os.path.join(root, filename))))
            print(filename + delim + abspath + delim + created + delim + modified + delim abspath + delim)

list_files(dir)
