# omo-textile-graphql-server
This is a prototype using a ApolloServer in order to use GraphQL queries with textile threads db.

# Install & Usage
- Create an APP Token for textile [documentation](https://docs.textile.io/)
- Create an .env file in root directory with following content

    `PORT=4000`

    `APOLLO_INTROSPECTION=true`

    `APOLLO_PLAYGROUND=true`

    `APP_TOKEN='<your textile token>'`

- build the project with `npm run build`
- open new terminal an run `npm run start:env`

Server will now launch on Port 4000 after seeding the textile Database

We didn't implement more detailed queries and input yet, but this will follow with our main project

Now you can play around with graphql playground manipulating data with on textile db

# example queries
## books
### listing all books with authors
`
query {
  books {
    title
    author {
      name
    }
  }
}
`
### add book
`mutation {
  addBook(title: "test", authorname: "testauthor", branchname: "testbranch") {
    title
  }
}`
### delete book
`mutation {
  deleteBook(id:"a3c7965a-cd3a-47da-a1c5-e1368f96c20d")
}` 
## libraries
### all with books and authors
`
query {
  libraries {
    branch
    books {
      title
      author {
        name
      }
    }
  }
}

`
## authors
### all with their books
`
query {
  authors {
    name
    books {
      title
    }
  }
}
`

## subscriptions
They will inform you by listening to changes in textile level. So even if you start Apollo Server on different machines it will work

### bookadded 
`
subscription {
  bookAdded {
    title
  }
}
`

### libraryadded 
`
subscription {
  libraryAdded {
    branch
  }
}
`

### authoradded 
`
subscription {
  authorAdded {
    name
  }
}
`
