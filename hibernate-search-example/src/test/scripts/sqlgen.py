#!/usr/bin/env python

import csv

input_filename = 'books.txt'
output_filename = 'books.sql'
batch_size = 1000

def main():
    input_file = file(input_filename,'rb')
    reader = csv.reader(input_file)
    output_file = file(output_filename,'wb')
    rownum = 1
    for row in reader:
        output_file.write("insert into book (title, author) values ('%s', '%s');\n" % (row[0].replace("'","''"), row[1].replace("'","''")))
        if rownum % batch_size == 0:
            output_file.write('commit;\n\n')
        rownum += 1
    output_file.write('commit;\n')
    
if __name__ == "__main__":
    main()
