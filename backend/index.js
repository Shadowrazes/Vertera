import Express from 'express';
import JWT from 'jsonwebtoken';

import { graphqlHTTP }  from 'express-graphql';
import { body } from 'express-validator';

import { typeDefs } from './GraphApi/schema.js';
import { resolvers } from './GraphApi/resolvers.js';
import { makeExecutableSchema } from '@graphql-tools/schema'

import fileUpload from 'express-fileupload';
import cors from 'cors';
import bodyParser from 'body-parser';
import _ from 'lodash'
import { FilelUpload } from './Utils/FileUpload.js';
import { fileURLToPath } from 'url';
import path from 'path';

const schema = makeExecutableSchema({ typeDefs, resolvers })
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = Express();
const port = '4444'

app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 2 * 1024 * 1024 // Bytes
    },
}));

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(Express.json());
app.use('/files', Express.static(__dirname + '/uploads'));
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true 
}));

app.post('/upload', async (req, res) => {
    FilelUpload(req, res);
});

app.listen(port, (err) => {
    if(err){
        return console.log(err);
    }

    console.log('Server started');
});