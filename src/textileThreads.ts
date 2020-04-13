; (global as any).WebSocket = require('isomorphic-ws')
import { authorSchema, bookSchema, librarySchema, author, book, library } from './schemas';
import * as uuid from 'uuid';
import { pubsub } from './resolvers';
import { Op } from '@textile/threads-store'
import { Database, Collection } from '@textile/threads-database'
import LevelDatastore from 'datastore-level'

export var Library: Collection<library>;
export var Book: Collection<book>;
export var Author: Collection<author>;

export async function initDB() {
    const store = new LevelDatastore('db/' + uuid.v4() + '.db')
    const db = new Database(store)
    await db.open();
    Library = await db.newCollection<library>("Library", librarySchema);
    Book = await db.newCollection<book>("Book", bookSchema);
    Author = await db.newCollection<author>("Author", authorSchema);

    // Subsriptions
    db.on('**', async (update) => {
        var collection = db.collections.get(update.collection);
        if (collection)
            switch (update.event.type) {
                case Op.Type.Create:
                    var patch: any;
                    patch = {};
                    patch[update.collection.toLowerCase() + 'Added'] = await collection.findById(update.id);
                    pubsub.publish(update.collection.toUpperCase() + '_ADDED', patch);
                    break;
            }
    })
}

export async function seedDB() {
    var downtown = new Library({ branch: 'downtown' });
    await downtown.save();

    var riverside = new Library({ branch: 'riverside' });
    await riverside.save();

    var rowling = new Author({ name: 'J.K. Rowling' });
    await rowling.save();

    var crichton = new Author({ name: 'Michael Crichton' });
    await crichton.save();

    var harryPotter = new Book({ title: 'Harry Potter and the Chamber of Secrets', authorId: rowling.ID, libraryId: downtown.ID });
    await harryPotter.save();

    var jurassicPark = new Book({ title: 'Jurassic Park', authorId: crichton.ID, libraryId: riverside.ID });
    jurassicPark.save();
}