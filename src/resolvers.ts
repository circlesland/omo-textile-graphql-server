import { Library, Author, Book } from './textileThreads'
import { author, book, library } from './schemas';
import { Result } from 'interface-datastore';

const { PubSub } = require('apollo-server');
export const pubsub = new PubSub();
export const BOOK_ADDED = 'BOOK_ADDED';
export const AUTHOR_ADDED = 'AUTHOR_ADDED';
export const LIBRARY_ADDED = 'LIBRARY_ADDED';

async function toArray<T>(iterator: AsyncIterable<Result<T>>): Promise<Array<T>> {
    const arr = Array<T>();
    for await (const entry of iterator) {
        arr.push(entry.value)
    }
    return arr;
}

export default {
    Library: {
        books: async (parent: library) => await toArray(await Book.find({ libraryId: parent.ID }))
    },
    Book: {
        author: async (parent: book) => await Author.findById(parent.authorId),
        library: async (parent: book) => await Library.findById(parent.libraryId)
    },
    Author: {
        books: async (parent: author) => { console.log(parent); return await toArray(await Book.find({ authorId: parent.ID })) }
    },
    Query: {
        libraries: async () => await toArray(await Library.find()),
        authors: async () => await toArray(await Author.find()),
        books: async () => await toArray(await Book.find()),
    },
    Mutation: {
        addBook: async (root: any, { title, authorname, branchname }: any) => {
            let book = await new Book({ title });
            if (authorname) {
                let a = (await Author.findOne({ name: authorname })).value;
                if (a == undefined) {
                    a = new Author({ name: authorname });
                    a.save();
                }
                else {
                    a = a.value;
                }
                book.authorId = a.ID;
            }
            if (branchname) {
                let l = (await Library.findOne({ branch: branchname })).value;
                if (l == undefined) {
                    l = new Library({ branch: branchname });
                    l.save();
                }
                else {
                    l = l.value;
                }
                book.libraryId = l.ID;
            }
            book.save();
            return book;
        },
        deleteBook: async (root: any, { id }: any) => {
            if (Book.has(id)) {
                await Book.delete(id);
            }
            return Book.has(id);
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

