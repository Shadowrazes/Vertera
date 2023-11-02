import Express from 'express';
import JWT from 'jsonwebtoken';

import { graphqlHTTP }  from 'express-graphql';
import { body } from 'express-validator';

import { typeDefs } from './GraphApi/schema.js';
import { resolvers } from './GraphApi/resolvers.js';
import { makeExecutableSchema } from '@graphql-tools/schema'

const app = Express();
const port = '4444'

app.use(Express.json());

const schema = makeExecutableSchema({ typeDefs, resolvers })
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true 
}));

app.get('/', (request, response) => {

});

app.listen(port, (err) => {
    if(err){
        return console.log(err);
    }

    console.log('Server started');
});