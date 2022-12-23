
import psycopg2




conn = psycopg2.connect(host="10.24.206.44", port=5432,
                        user="cs309_proj", password="123456",
                        database='postgres'  #
                        )
postgres = conn.cursor()


update_sql = "update postgres.intro_ai.need_book set total = total+1, {} = {}+1 where sid = {}"


select_sql = "select sid, last_name, substr(evaluate,1,1) as type from postgres.intro_ai.loan_data where loan_date >= (select current_date-1) and loan_date < (select current_date);"

insert_sql = "insert into postgres.intro_ai.need_book(sid, name, total, {}) values ({},'{}',1,1)"

check_sql = "select * from postgres.intro_ai.need_book where sid = {}"

if __name__ == '__main__':
    postgres.execute(select_sql)
    data = postgres.fetchall()

    for line in data:
        sel = check_sql.format(str(line[0]))
        postgres.execute(sel)
        check = postgres.fetchone()

        if check == None:
            s = insert_sql.format(str(line[2]), str(line[0]), str(line[1]))
        else:
            s = update_sql.format(str(line[2]),str(line[2]),str(line[0]))
        postgres.execute(s)

    print("done")
    conn.commit()
    postgres.close()
    conn.close()

