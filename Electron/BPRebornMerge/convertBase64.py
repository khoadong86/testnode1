#!/usr/bin/python

# The MIT License (MIT)
#
# Copyright (c) 2012-2013 Teemu Ikonen
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
#
# Tool that accepts multiple images as arguments and tries to fit them to single image
# Image locations are written out as json file.
#
# ImageMagick 6.8 or later must be installed and in the command path. Tool uses commands 'identify' and 'convert'.
#
# $ ./packer.py <image1>, <image2>, ..
#
# Tool outputs atlas image and json and css files that map the image locations on the atlas
#

import subprocess
import argparse
import re
import os, sys
import json
import base64

parser = argparse.ArgumentParser(description="Packs images to atlas. Uses ImageMagick to parse and compose the images")
parser.add_argument('files', metavar='FILE', type=str, nargs='+', help="Image file")
parser.add_argument("-ip", dest="inpath", type=str, default='', help="input path")
parser.add_argument("-o", dest="outfile", type=str, default='out.png', help="Output atlas file")
parser.add_argument("-str", dest="outstr", type=str, default='', help="Output string for resources")

args = parser.parse_args()

# Check that ImageMagick is installed
def is_im_installed():
	print "Checking ImageMagick"
	try:
		o = subprocess.check_output(['identify', '--version'], stderr=subprocess.STDOUT).strip()
		if not o.find('ImageMagick'):
			print "\nUnknown output from identify, is ImageMagick installed?"
			return False
		else:
			print 'Found: ' + o.split('\n')[0]
			return True
	except Exception as e:
		print "ImageMagick identity not found:",e
		return False

#if not is_im_installed():
#	sys.exit(1)

def bname(file):
	l = os.path.basename(file).split('.')
	return ''.join(l[:-1])

print "==========================="
print "Resolving file dimensions"

blocks = []

base64file = []
if args.inpath != "":
	args.inpath = args.inpath + '/';
# Use identify command to get file dimensions
for file in args.files:
	with open(args.inpath + file, "rb") as imageFile:
		extension = os.path.splitext(file)[1][1:]
		str = "data:image/" + extension + ";base64," + base64.b64encode(imageFile.read())
		base64file.append({
			'name': file,
			'content': str
		})
		
info = {}
base64Out = {}

try:
	for ba in base64file:
		base64Out[args.outstr + ba['name']] = {
			'name': ba['name'], 
			'content': ba['content']
		}
	# write import JS file
	bvar = 'var res_embed_bp'
	f = open(args.outfile, 'w')
	f.write(bvar+' = '+json.dumps(base64Out, sort_keys=True, indent=4))
	f.close()

except subprocess.CalledProcessError as e:
	print "failed to process, error: {0}".format(e.output),