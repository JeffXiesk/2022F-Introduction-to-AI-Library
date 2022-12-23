import psycopg2


conn = psycopg2.connect(host="10.24.206.44", port=5432,
                        user="cs309_proj", password="123456",
                        database='postgres'#
                        )

insert_sql="""insert into postgres.intro_ai.library_time (sid, name, days_in_lib, time_in_lib_min) VALUES ({},'{}',{},{})"""

postgres = conn.cursor()
postgres.execute('truncate table intro_ai.library_time')

if __name__ == '__main__':

    with open('./table/lib_intime_data.csv','r',encoding='UTF-8') as f:
        lines = f.readlines()
        for i in lines:

            arr = i.strip("\n").split(',')
            check = None
            try:
                check = int(arr[0])
            except:
                None
            if check != None:
                if len(arr) == 4:
                    days_in = arr[2]
                    if days_in == 'None':
                        days_in = 0
                    time_in_lib = arr[3]
                    if arr[3] == 'None':
                        time_in_lib = 0

                    s = insert_sql.format(arr[0],arr[1],days_in,time_in_lib)
                    postgres.execute(s)
                else:
                    days_in = arr[-2]
                    if days_in == 'None':
                        days_in = 0
                    time_in_lib = arr[-1]
                    if arr[3] == 'None':
                        time_in_lib = 0



    print("Done")
    conn.commit()
    postgres.close()
    conn.close()
