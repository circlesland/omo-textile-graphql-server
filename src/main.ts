import { ApolloServer } from 'apollo-server';

import { environment } from './environment';
import resolvers from './resolvers';
import typeDefs from './schemas';
import { initDB, seedDB } from './textileThreads'


const server = new ApolloServer({
    resolvers,
    typeDefs,
    introspection: environment.apollo.introspection,
    playground: environment.apollo.playground,
    tracing: true
});

initDB()
    .then(() => seedDB().then(() =>
        server.listen(environment.port).then(({ url }) => {
            console.log(`Server ready at ${url}. `);
        })
    ))
    .catch(err => console.error("err: ", err));

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => server.stop());
}