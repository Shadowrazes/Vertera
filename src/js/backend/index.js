import Express from 'express';
import JWT from 'jsonwebtoken';

import { importSchema } from 'graphql-import';
import { graphqlHTTP }  from 'express-graphql';
import { buildSchema } from 'graphql';
import { body } from 'express-validator';


const app = Express();
app.use(Express.json());
const port = '4444'

app.get('/', (request, response) => {
    response.send('Hello');
});

app.listen(port, (err) => {
    if(err){
        return console.log(err);
    }

    console.log('Server started');
});