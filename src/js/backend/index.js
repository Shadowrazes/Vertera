import Express from 'express';
import JWT from 'jsonwebtoken';

import { graphqlHTTP }  from 'express-graphql';
import { body } from 'express-validator';

import { schema } from './GraphApi/schema.js';
import { resolvers } from './GraphApi/resolvers.js';

import Pool from './DB/Connect.js';
import UserEntity from './Entities/User.js';

const app = Express();
const port = '4444'

UserEntity.pool = Pool;

app.use(Express.json());

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true 
}));

app.get('/', (request, response) => {
    UserEntity.Get(1, response);
});

app.listen(port, (err) => {
    if(err){
        return console.log(err);
    }

    console.log('Server started');
});

// const a = UserEntity.Get(1);
// console.log(7);