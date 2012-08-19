#!/usr/bin/env python

import sys
import time
import re
import urllib2
import csv
import HTMLParser

list_pattern = re.compile(r"<li><a href=.*?</li>")
book_pattern = re.compile(r".*?<cite>(.*?)</cite>.*?,\s+by\s+(.*?)[(,<]")
next_link_pattern = re.compile(r'-- <a href="([^"]*)">next&gt;</a>')

start_url = 'http://onlinebooks.library.upenn.edu/webbin/book/browse?type=title'
output_filename = 'books.txt'
book_count = 0

def main() :
    global book_count
    verbose = len(sys.argv) > 1 and sys.argv[1] == '-v'
    output_file = file(output_filename,'wb')
    writer = csv.writer(output_file)
    parser = HTMLParser.HTMLParser()
    next_link = start_url
    
    while next_link:
        print 'parsing', next_link
        print
        page = urllib2.urlopen(next_link).read()
        for match in list_pattern.finditer(page):
            listitem = match.group(0)
            book_match = book_pattern.match(listitem)
            if book_match:
                try:
                    title = parser.unescape(book_match.group(1)).encode('utf8').strip()
                    author = parser.unescape(book_match.group(2)).encode('utf8').strip()
                    writer.writerow([title, author])
                    if verbose:
                        print 'title:', title
                        print 'author:', author
                        print
                    book_count += 1
                except UnicodeDecodeError:
                    pass
        link_match = next_link_pattern.search(page)
        if link_match:
            next_link = link_match.group(1)
        else:
            next_link = None
        output_file.flush()
        time.sleep(2)
        
    print 'wrote', book_count, 'books'
    print 'done'
    
if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print 'wrote', book_count, 'books'
