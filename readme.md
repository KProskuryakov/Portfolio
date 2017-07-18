# Readme
This project is a way for me to demonstrate my skills as a programmer. 
As I acquire more skill, this will be updated to reflect what I've learned. 

## Current goals
* Figure out how to debug browser code in VSCode.
* Update lasergame to be more user friendly

## Lasergame
### Cool levels
https://kostyapro.herokuapp.com/lasergame/seed/medium/1497995208658
https://kostyapro.herokuapp.com/lasergame/seed/medium/1498000079304

## Environment
This section describes my dev environment and production pipeline.

### Setting up the dev environment
Download [Node.js](https://nodejs.org/) (I try to stay on the latest LTS version)

Download [Visual Studio Code](https://code.visualstudio.com/) (My code editor of choice. Keep up to date)

Download [PostgreSQL](https://www.postgresql.org/) (The database I use)

Download [Heroku](https://www.heroku.com/) (The production service I use)

These installations should also install npm and git.

Optionally install [Github Desktop](https://desktop.github.com/)

Clone the repo.

```
npm update
tsc
webpack
```

Create the `.env` file as shown in the section below. Make sure the db info is correct.

In VSCode, there is a debug routine called `nodemon` which spins up the dev server.

Then open up two shell windows, both navigated to the root folder of the project. In the first window execute `tsc -w` and in the second execute `webpack -w`.

Running `heroku local` is a way to test whether the code will work on the heroku server.

### ENV variables
Create a `.env` file in the root folder for the vscode debugger and `heroku local` to work.

```
SECRET_KEY=ForDevPurposes
DATABASE_URL=postgres://postgres:password@localhost:5432/portfolio
IS_DATABASE_SSL=false
```

### Current settings in vscode:
```
{
  "editor.renderWhitespace": "boundary",
  "editor.minimap.enabled": true,
  "editor.renderIndentGuides": true,
  "workbench.iconTheme": "vscode-icons",
  "editor.renderControlCharacters": false,
  "git.confirmSync": false,
  "editor.tabSize": 2,
  "editor.detectIndentation": false
}
```

### Current extensions in vscode:
These are all extensions that I use specifically for this project.

* Document This
* gitignore (CodeZombie)
* HTML CSS Support
* Markdown Shortcuts
* Move TS
* TODO Parser
* VS Color Picker
* vscode-icons