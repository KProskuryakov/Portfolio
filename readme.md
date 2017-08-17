# Readme
This project is a way for me to demonstrate my skills as a programmer. 
As I acquire more skill, this will be updated to reflect what I've learned. 

## Current goals
* Feature updates to Lasergame
* Start a new game project
* Build a simple secret santa manager
* Test out my dev environment setup instructions below


## Lasergame
### Cool levels
https://kostyapro.herokuapp.com/lasergame/seed/medium/1497995208658
https://kostyapro.herokuapp.com/lasergame/seed/medium/1498000079304

## Environment
This section describes my dev environment and production pipeline.

### Setting up the dev environment
Download [Node.js](https://nodejs.org/) (I try to stay on the latest version)

Download [git](https://git-scm.com/) (Needed for github integration in vscode)

Download [Visual Studio Code](https://code.visualstudio.com/) (My code editor of choice. Keep up to date)

Download [PostgreSQL](https://www.postgresql.org/) (The database I use)

Download [Heroku](https://www.heroku.com/) (The production service I use)

Download [Python 2](https://www.python.org/) (Needed for node.gyp)

Optionally install [Github Desktop](https://desktop.github.com/)

Clone the repo.

```
npm update
tsc
webpack
```

In Windows, I had to add the PostgreSQL `bin` folder to PATH.

Create the `.env` file as shown in the section below. Make sure the db info is correct.

In VSCode, there is a debug routine called `nodemon` which spins up the dev server.

Then open up two shell windows, both navigated to the root folder of the project. In the first window execute `tsc -w` and in the second execute `webpack -w`.

Running `heroku local` is a way to test whether the code will work on the heroku server.

### ENV variables
Create a `.env` file in the root folder for the vscode debugger and `heroku local` to work.

```
SECRET_KEY=SuperSecretKey
DATABASE_URL=postgres://postgres:password@localhost:5432/portfolio
IS_DATABASE_SSL=false
```

### TSLint

I use TSLint's `latest` setting to lint all of my code. It does the job and it does it well.
For consistencies sake, 2 spaces are used throughout the whole project. I highly recommend the TSLint extension fo
vscode. It was a lifesaver when linting my codebase.

### PostgreSQL

These commands should be run on the database before running the app for the first time.

In the heroku production environment, connect to the db by running `heroku pg:psql` and then execute the commands. 
Postgres has to be installed for this to work

```sql
CREATE TABLE IF "session" (
  "sid" varchar NOT NULL COLLATE "default" PRIMARY KEY NOT DEFERRABLE INITIALLY IMMEDIATE,
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
CREATE TABLE lasergame_daily_levels
(
  daily_date date PRIMARY KEY DEFAULT CURRENT_DATE,
  level_data jsonb NOT NULL,
  seed bigint NOT NULL,
  times_beaten int DEFAULT 0
);
CREATE TABLE IF lasergame_levels
(
  id serial PRIMARY KEY,
  name varchar(64) NOT NULL,
  level_data jsonb NOT NULL,
  upload_timestamp timestamptz DEFAULT current_timestamp,
  times_beaten int DEFAULT 0,
  user_display_name varchar(64) references site_users (display_name)
);
CREATE TABLE IF site_users
(
  email varchar(256) PRIMARY KEY,
  password varchar(80) NOT NULL,
  display_name varchar(64) UNIQUE NOT NULL
);
CREATE TABLE IF web_data
(
  url text PRIMARY KEY,
  title text,
  keywords text,
  description text,
  upload timestamptz DEFAULT current_timestamp
);
```

### Current settings in vscode:
```json
{
  "editor.renderWhitespace": "boundary",
  "editor.minimap.enabled": true,
  "editor.renderIndentGuides": true,
  "workbench.iconTheme": "vscode-icons",
  "editor.renderControlCharacters": false,
  "git.confirmSync": false,
  "editor.tabSize": 2,
  "editor.detectIndentation": false,
  "TodoParser": {
    "exclude": ["cpp", "c", "js"],
    "folderExclude": ["node_modules", ".vscode"],
    "only": ["sub-folder/sub-sub-folder"],
    "showInProblems": false,
    "markers": ["NOTE:", "REMINDER:", ["FIXME", "Warning"]],
    "autoDefaultMarkers": true
  },
  "tslint.enable": true
}
```

### Current extensions in vscode:
These are all extensions that I use specifically for this project.

* Document This
* gitignore (CodeZombie)
* HTML CSS Support
* Markdown Shortcuts
* Move TS
* npm
* TODO Parser
* TSLint
* Untabify
* VS Color Picker
* vscode-icons