#!/usr/bin/python
from shutil import copy
import sys

print('Python:', len(sys.argv), str(sys.argv))

copy(sys.argv[1], sys.argv[2])