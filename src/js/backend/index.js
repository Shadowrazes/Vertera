import Express from 'express';
import JWT from 'jsonwebtoken';

import { graphqlHTTP }  from 'express-graphql';
import { body } from 'express-validator';

import { schema } from './GraphApi/schema.js';
import { resolvers } from './GraphApi/resolvers.js';

const app = Express();
const port = '4444'

app.use(Express.json());

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true 
}));

app.get('/', (request, response) => {
    response.send('Hello');
});

app.listen(port, (err) => {
    if(err){
        return console.log(err);
    }

    console.log('Server started');
});