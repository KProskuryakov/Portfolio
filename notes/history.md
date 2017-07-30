# History
This is an area to mark significant changes to the site.

## The Beginning
In the beginning, my Lasergame was written in Lua using [Love2D](http://love2d.org/). Lua was cool and all but I got fed up with having to bundle my game into an exe and then uploading it to google drive so that other people could play it. Javascript was similar enough to Lua so I rewrote the whole game ending with a 1000 line long file that somehow seemed to work. I made a quick node.js express project and this crazy journey began. I used bootstrap for the navbar and made a MongoDB database to store player-made levels.

## Javascript to Typescript with Webpack for Frontend
As beloved as pure javascript is, the lack of any kind of type declarations was driving me up the wall. My inital version of Lasergame was all written in pure javascript in a single 1000 line long file and it was becoming a chore to maintain and keep track of. I was using ES6 features since my only build target at the time was the latest chrome version. I wanted two specific things: type checking and modules in seperate files. Now with Typescript and Webpack (via ts-loader), I have both features. Webpack can be launched in a watch mode to trigger whenever any files are changed (which is awesome).

I also looked into gulp to automate the webpack process but that grew too complicated and was getting too many strange errors. I settled for a quick `webpack -w` in a seperate console window and everything seemed to work fine.

## PostgreSQL
I much prefer SQL to MongoDB simply because I can very clearly define what kind of data I expect. The change wasn't too hard either, I switched to the default pg/pg-pool setup and manually defining my access methods in `postgresdb.js`. I looked a little into sequilize and it's definitely worthwhile but not really what I need right this moment. I need to really know what SQL statements look like and how they work.

## Javascript to Typescript for Backend
Now, the hardest part about transitioning my entire codebase to Typescript was the seperation between frontend and backend. It puzzled me for a while because you could only have one `tsconfig.js` file in a project and I really didn't want to split the code into two projects, because a lot of the lasergame code relies on the same data structures on both sides of the API. Luckily, webpack's config file allows you to use the majority of the settings in the existing tsconfig.js while also letting you set seperate output files. Now I'm relying on two commands to properly generate code for either side: `tsc -w` for the backend and `webpack -w` for the frontend. Thus, whenever my code changes everything gets recompiled. When that happens, nodemon picks up on it and restarts the server for me.

I ended up splitting some of the classes in Lasergame to decouple the class code from the drawing code, for example `lasergrid.ts` and `lasergrid_component.ts`. This allows me to instantiate instances of Lasergrid in the backend for level generation and whatever else I think of in the future.

## ngrok
ngrok is a localhost tunneler program that was my first method of exposing the web server to outside traffic. I only really used it to show some of my friends because I didn't want to leave it up too long. It wasn't long after that I wanted to look into a more permanent solution.

## Heroku
I stumbled into heroku when I was looking into paid webserver hosting. I did a bit of research and decided to dive into a free heroku dyno. I added a free postgres database to it and quite a bit of fiddling later, I was all good to go with my own kostyapro.herokuapp.com. The fiddling involved setting up a `.env` file to differentiate my dev environment and the heroku production environment and making an npm `postinstall` script that compiled the typescript files on heroku. It was at this time that I removed `secret.js` and shoved the keys/database connection into the `.env` file. I also had to make the vscode debugger read the `.env` file since the `heroku local` command would do it for me but the `nodemon` debugger did not. It was a simple fix of just adding an `envFile` to `launch.json`.

## TSLint
At some point earlier I was really trying for a minimalist coding approach so I deleted every line ending semi-colon throughout my project. When I added TSLint I put them all back. With the TSLint vscode plugin it was rather simple to fix the linting errors. Everything is now neat and tidy. I even added a `lint` npm script in case a full project check needs to be done again.

## connect-pg-simple
This whole time I've been yelled at by the terminal to stop using express-session's memory store for session management because it would leak memory. I finally obliged and added `connect-pg-simple` to store sessions in the database. I got hit by a nasty bug when I accidentally swapped a few of the `app.use` lines in the main `app.ts` file. It led me on an awful goose chase that only finished when I looked through my git changes since the last version and noticed that the lines were switched. It was giving me this weird pug error when going to `localhost:5000` and the breakpoint inside of the route wouldn't even trigger.