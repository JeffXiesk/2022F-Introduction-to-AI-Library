import psycopg2



if __name__ == '__main__':

    conn = psycopg2.connect(host="10.24.206.44", port=5432,
                            user="cs309_proj", password="123456",
                            database='postgres'#
                            )

    insert_sql_book="""insert into postgres.public.book_book (id, isbn, publisher, permanent_call_number, title, new_title, show_title, writer, keyword, writer_keyword, type) VALUES ({},' ',' ','{}','{}','{}','{}',' ',' ',' ','{}')"""

    select_sql_book = '''select distinct title,  type, barcode from postgres.intro_ai.loan_data'''

    insert_sql="""insert into postgres.public.bookloadrecord_bookloadrecord(id, user_id, book_id, which_library, loan_date, return_date, patron_group, barcode, loans) VALUES ({},{},{},' ','{}','{}','{}','{}',{})"""
    insert_sql2="""insert into postgres.public.bookloadrecord_bookloadrecord(id, user_id, book_id, which_library, loan_date, return_date, patron_group, barcode, loans) VALUES ({},{},{},' ','{}',null,'{}','{}',{})"""

    select_sql = '''select sid,barcode,loan_date,return_date,patron_group,loans  from postgres.intro_ai.loan_data'''

    postgres = conn.cursor()
    postgres.execute('truncate table bookloadrecord_bookloadrecord')
    postgres.execute('truncate table book_book')


    postgres.execute(select_sql_book)
    book = postgres.fetchall()
    barcode_to_book_id={}
    cnt = 0
    for line in book:
        title = line[0].replace('\'','')
        s = insert_sql_book.format(cnt, line[2], title,title,title,line[1])
        barcode_to_book_id[line[2]]=cnt
        cnt += 1
        postgres.execute(s)
        # if cnt % 1000==0:
        #     print(cnt)
    conn.commit()
    print("Add book done !")
        

    postgres.execute(select_sql)
    data = postgres.fetchall()
    cnt = 0
    for line in data:
        if line[3] == None:
            s = insert_sql2.format(cnt, line[0], barcode_to_book_id[line[1]], line[2],line[4],line[1],line[5])
        else:
            s = insert_sql.format(cnt, line[0], barcode_to_book_id[line[1]], line[2],line[3],line[4],line[1],line[5])
        cnt += 1
        postgres.execute(s)

        # if cnt % 1000==0:
        #     print(cnt)

    conn.commit()
    print("Done")
    postgres.close()
    conn.close()
