; (global as any).WebSocket = require('isomorphic-ws')
import { API } from '@textile/textile'
import { Client } from "@textile/threads-client";
import { authorSchema, bookSchema, librarySchema, Author, Book, Library } from './schemas';
import * as uuid from 'uuid';
import { pubsub, BOOK_ADDED, AUTHOR_ADDED, LIBRARY_ADDED } from './resolvers';

export var client: Client;
export var storeId = "";


export async function initDB() {
    let api = new API({
        token: process.env.APP_TOKEN || '',
        deviceId: uuid.v4()
    });

    await api.start();
    client = new Client(api.threadsConfig);
    storeId = (await client.newStore()).id;
    await client.registerSchema(storeId, 'Library', librarySchema);
    await client.registerSchema(storeId, 'Book', bookSchema);
    await client.registerSchema(storeId, 'Author', authorSchema);
    client.start(storeId);
    client.listen<Book>(storeId, 'Book', '', (book) => {
        if (book)
            pubsub.publish(BOOK_ADDED, { bookAdded: book.entity });
    })
    client.listen<Library>(storeId, 'Library', '', (library) => {
        if (library)
            pubsub.publish(LIBRARY_ADDED, { libraryAdded: library.entity });
    })
    client.listen<Author>(storeId, 'Author', '', (author) => {
        if (author)
            pubsub.publish(AUTHOR_ADDED, { authorAdded: author.entity });
    })

}


export async function seedDB() {
    let libraries = [
        {
            ID: null,
            branch: 'downtown'
        },
        {
            ID: null,
            branch: 'riverside'
        }];
    await client.modelCreate(storeId, 'Library', libraries);

    let authors = [
        {
            ID: null,
            name: 'J.K. Rowling'
        },
        {
            ID: null,
            name: 'Michael Crichton'
        }];
    await client.modelCreate(storeId, 'Author', authors);

    let books = [
        {
            title: 'Harry Potter and the Chamber of Secrets',
            authorId: authors[0].ID,
            libraryId: libraries[0].ID
        },
        {
            ID: uuid.v4(),
            title: 'Jurassic Park',
            authorId: authors[1].ID,
            libraryId: libraries[1].ID
        }];
    await client.modelCreate(storeId, 'Book', books);
    console.log('seeded');
}