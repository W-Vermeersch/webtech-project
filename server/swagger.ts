const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'My API',
        description: 'Description'
    },
    host: 'localhost:5000'
};

const outputFile = './swagger-output.json';
const routes = ['./controllers/user-authentification/signIn.controller.ts', './controllers/post/post.controller.ts'];

swaggerAutogen(outputFile, routes, doc);