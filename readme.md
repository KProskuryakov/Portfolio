# Readme

This project is a way for me to show off my skills as a programmer. 
As I learn more, this will be updated to reflect what I've learned. 
This is also where my notes regarding programming are stored.

## Lasergame

### Cool level
```
2  -> {20 black, 14 blue, blocked blue} ({20 black, 14 blue, blocked blue})
6  -> 4 black (4 black)
13 -> blocked magenta (blocked magenta)
14 -> 2 blue (2 blue)
17 -> blocked black (blocked black)
```

## Environment

### secret.js

This is what the config file in `js/` looks like:
```
module.exports.pgconfig = {
  user: 'postgres',
  database: 'mydb',         // Not my actual db name
  password: 'mypassword',   // Not my actual db password
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

module.exports.secretkey = "Secretkey";   // The key for cookie-parser and session management
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

* Debugger for Chrome
* Document This
* gitignore
* HTML CSS Support
* Markdown Shortcuts
* Move TS
* TODO Parser
* VS Color Picker
* vscode-icons