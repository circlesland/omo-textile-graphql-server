import { gql } from 'apollo-server';

export default gql`
  # A library has a branch and books
  type Library {
    ID:String!
    branch: String!
    books: [Book!]
  }

  # A book has a title and author
  type Book {
    ID:String!
    title: String!
    author: Author!
    library: Library
  }

  # An author has a name
  type Author {
    ID:String!
    name: String!
    books: [Book]
  }

  type Query {
    libraries: [Library]
    books: [Book]   
    authors: [Author]
  }

  type Mutation {
    addBook(title: String, authorname: String, branchname:String): Book
    deleteBook(id: String): [Book]
  }

  type Subscription {
    bookAdded: Book
    libraryAdded: Library
    authorAdded: Author
  }
`;

export const librarySchema = {
  $id: 'https://example.com/person.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Library',
  type: 'object',
  required: ['ID'],
  properties: {
    ID: {
      type: 'string',
      description: "The instance's id.",
    },
    branch: {
      type: 'string',
      description: "Branch Name",
    }
  },
}

export const bookSchema = {
  $id: 'https://example.com/person.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Book',
  type: 'object',
  required: ['ID'],
  properties: {
    ID: {
      type: 'string',
      description: "The instance's id.",
    },
    title: {
      type: 'string',
      description: "The book title",
    },
    authorId: {
      type: 'string',
      description: "The author.",
    },
    libraryId: {
      type: 'string',
      description: "The Library the book belongs to"
    }
  },
}

export const authorSchema = {
  $id: 'https://example.com/person.schema.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Author',
  type: 'object',
  required: ['ID'],
  properties: {
    ID: {
      type: 'string',
      description: "The instance's id.",
    },
    name: {
      type: 'string',
      description: "The book title",
    }
  },
}

export interface Library {
  ID: string,
  branch: string
}

export interface Book {
  ID: string,
  title: string,
  authorId: string,
  libraryId: string
}

export interface Author {
  ID: string,
  name: string
}