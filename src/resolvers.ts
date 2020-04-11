import { client, storeId } from './textileThreads'
import { Author, Book, Library } from './schemas';
import { Query } from "@textile/threads-client";

const { PubSub } = require('apollo-server');
export const pubsub = new PubSub();
export const BOOK_ADDED = 'BOOK_ADDED';
export const AUTHOR_ADDED = 'AUTHOR_ADDED';
export const LIBRARY_ADDED = 'LIBRARY_ADDED';

export default {
    Library: {
        books: async (parent: Library) => (await client.modelFind(storeId, "Book", new Query().and("libraryId").eq(parent.ID))).entitiesList
    },
    Book: {
        author: async (parent: Book) => (await client.modelFindByID(storeId, "Author", parent.authorId)).entity,
        library: async (parent: Book) => (await client.modelFindByID(storeId, "Library", parent.libraryId)).entity,
    },
    Author: {
        books: async (parent: Library) => (await client.modelFind(storeId, "Book", new Query().and("authorId").eq(parent.ID))).entitiesList
    },
    Query: {
        libraries: async () => (await client.modelFind(storeId, "Library", {})).entitiesList,
        authors: async () => (await client.modelFind(storeId, "Author", {})).entitiesList,
        books: async () => (await client.modelFind(storeId, "Book", {})).entitiesList
    },
    Mutation: {
        addBook: async (root: any, { title, authorname, branchname }: any) => {
            let author = null;
            let library = null;
            let book = { title, authorId: null, libraryId: null };
            if (authorname) {
                var authors = (await client.modelFind(storeId, "Author", new Query().and("name").eq(authorname))).entitiesList;
                author = authors.length > 0 ? authors[0] : (await client.modelCreate<Author>(storeId, "Author", [{ name: authorname }])).entitiesList[0]
                book.authorId = author.ID;
            }
            if (branchname) {
                var libraries = (await client.modelFind(storeId, "Library", new Query().and("branch").eq(branchname))).entitiesList;
                library = libraries.length > 0 ? libraries[0] : (await client.modelCreate<Library>(storeId, "Library", [{ branch: branchname }])).entitiesList[0];
                book.libraryId = library.ID;
            }
            await client.modelCreate<Book>(storeId, "Book", [book]);
            return book;
        },
        deleteBook: async (root: any, { id }: any) => {
            await client.modelDelete(storeId, "Book", [id])
            return async () => (await client.modelFind(storeId, "Book", {})).entitiesList;
        }
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator([BOOK_ADDED]),
        },
        authorAdded: {
            subscribe: () => pubsub.asyncIterator([AUTHOR_ADDED]),
        },
        libraryAdded: {
            subscribe: () => pubsub.asyncIterator([LIBRARY_ADDED]),
        }
    },
};

