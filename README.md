# Connect X

[![N|Solid](https://cldup.com/dTxpPi9lDf.thumb.png)](https://nodesource.com/products/nsolid)

Connect X is a multiplayer game project used to experiment with React.
Long term goals include adding an artificial intelligent opponent,
modifying the idea of gravity, and introducing new kinds of play options to the classic game.

### Tech

Connect X is build on a number of open source projects:

* [React]
* [MongoDB]
* [Socket.io]
* [React Bootstrap]
* [node.js]
* [Express]
* [Heroku]

### Installation

Connect X requires [Node.js](https://nodejs.org/) v8.5+ to run.

Install MongoDb

Install the dependencies and devDependencies

```sh
$ npm install
```

Install Heroku [CLI Instructions](https://devcenter.heroku.com/articles/heroku-cli)

Create an .env file with the following configuration settings:

* MONGODB_CONNECTION_STR=[e.g. mongodb://admin:adminPassword@mlab.com:21686/heroku_XXXXXX]
* GAMEMASTER_EMAIL_SERVICE=[e.g. gmail]
* GAMEMASTER_EMAIL_ADDRESS=[e.g. noreply.yourtestemail@gmail.com]
* GAMEMASTER_EMAIL_PASSWORD=[some password]
* APP_BASE_URL=[http://localhost:5000]

Build and then start the server

```sh
$ npm run build
$ heroku local web
```

### Todos

 - Write MORE Tests

License
----

MIT

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [dill]: <https://github.com/gtrodriguez>
   [git-repo-url]: <https://github.com/gtrodriguez/fictional-octo-guacamole>
   [john gruber]: <http://gabe-rodriguez.com>
   [Socket.io]: <https://socket.io/>
   [MongoDb]: <https://mongodb.com/>
   [node.js]: <http://nodejs.org>
   [React Bootstrap]: <https://react-bootstrap.github.io/>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [React]: <https://react-bootstrap.github.io>
   [Heroku]: <https://heroku.com>
