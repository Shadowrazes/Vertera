import Express from 'express';

import { graphqlHTTP }  from 'express-graphql';

import { typeDefs } from './GraphApi/Schema.js';
import { resolvers } from './GraphApi/Resolvers.js';
import { makeExecutableSchema } from '@graphql-tools/schema'

import fileUpload from 'express-fileupload';
import cors from 'cors';
import bodyParser from 'body-parser';
import _ from 'lodash'
import { FilelUpload } from './Utils/FileUpload.js';
import { fileURLToPath } from 'url';
import path from 'path';

import * as https from 'https';
import * as fs from 'fs';

const schema = makeExecutableSchema({ typeDefs, resolvers })
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = Express();
const port = '4444';

const isBuild = process.argv[2] === 'build';

app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 10 * 1024 * 1024 // Bytes
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

if(!isBuild) {
    app.listen(port, (err) => {
        if(err){
            return console.log(err);
        }
    
        console.log('Server started');
    });
}
else {
    const options = {
        cert: fs.readFileSync('/etc/letsencrypt/live/vticket.yasanyabeats.ru/fullchain.pem'),
        key: fs.readFileSync('/etc/letsencrypt/live/vticket.yasanyabeats.ru/privkey.pem')
    };
    //express.listen(port);
    https.createServer(options, app).listen(port);
    console.log('Server HTTPS started');
}