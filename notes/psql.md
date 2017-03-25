# PostgreSQL Notes
## Learning SQL
### Setup on Windows
It took me a little while to set up. There was a bit of fiddling that I had to do through pgadmin.

Installing it doesn't update the PATH variables for whatever reason, so the first step was to add the `bin/` folder to path.

When you first install postgres, the first user created is called postgres and it's the primary superuser.

I added a new user/role through pgadmin called 'kosty' which is what my user account is called.
When you run a postgres command, it'll ask for the password for an account with the same name as your os user.
I set the password of this user in pgadmin.

### First steps
This made a database and psql launched the command line interface that postgres has bundled with it.

```
createdb mydb
psql mydb
mydb=#
```

These are some sample commands that can be run in the terminal.

```
SELECT version();
SELECT current_date;
SELECT 2 + 2;
```

These are psql commands, not postgres SQL language.

```
\h      # help
\q      # quit
```

### Creating Tables
SQL commands generally ignore whitespace so you just have to follow the commas. `--` is for comments.
Postgres supports special data types like `point` that aren't present in basic SQL.

```
CREATE TABLE weather (
    city            varchar(80),
    temp_lo         int,           -- low temperature
    temp_hi         int,           -- high temperature
    prcp            real,          -- precipitation
    date            date
);

CREATE TABLE cities (
    name            varchar(80),
    location        point
);

DROP TABLE tablename     -- will delete the table. Use with caution.
```

### Inserting into tables
You can insert values into a table by supplying the values in the order they appear, or you can explicitly define the order/which values you want to insert.

```
INSERT INTO weather VALUES ('San Francisco', 46, 50, 0.25, '1994-11-27');

INSERT INTO cities VALUES ('San Francisco', '(-194.0, 53.0)');

INSERT INTO weather (city, temp_lo, temp_hi, prcp, date) VALUES ('San Francisco', 43, 57, 0.0, '1994-11-29');

INSERT INTO weather (date, city, temp_hi, temp_lo) VALUES ('1994-11-29', 'Hayward', 54, 37);
```

### psql commands
[Cheatsheet](http://www.postgresonline.com/downloads/special_feature/postgresql83_psql_cheatsheet.pdf)

```
\dt    # list all tables
\d tablename    #list the table columns
```

### Querying a table

```
SELECT * FROM weather
```

# Portfolio DB
### Setup
I would replace username and password with the appropriate values, of course.
```js
module.exports.pgconfig = {
    user: 'username',
    database: 'portfolio',
    password: 'password',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
};
```
### Accessing it
Who needs pgAdmin when you have the command line and time?
```
psql portfolio
```
### Current user setup
It's a huge pain to enter these manually. One day I'll make an 'if not created, create' clause.
```
CREATE TABLE users (
    email varchar(256),
    password varchar(256)
);
```
### Insert new users
Unfortunately all of these queries would have to be changed if the structure of the user is changed significantly.
Glad I can keep them all in the same file and they're probably more reusable than the ones for mongo.
```
pgPool.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, pass]);
```

