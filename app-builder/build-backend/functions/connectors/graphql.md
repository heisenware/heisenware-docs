# GraphQL

The `Graphql` class is a utility for interacting with GraphQL APIs. It provides a single static function to send queries or mutations to a GraphQL endpoint and retrieve the results.

Since the method is **static**, you do not need to create an instance of this class.

***

### request

Sends a query or a mutation to a specified GraphQL API endpoint.

**Parameters**

* `url`: The endpoint URL of the GraphQL API.
* `document`: The GraphQL query or mutation, written in standard GraphQL syntax.
* `variables`: An optional object containing any variables required by the document.
* `headers`: An optional object for sending request headers, commonly used for authentication.

**Example: Simple Query** This example queries for a list of movies.

```yaml
# url
https://api.example.com/graphql
# document
query {
  movies {
    id
    title
    releaseYear
  }
}
```

**Example: Query with Variables** This example fetches a single movie by its ID, which is passed as a variable.

```yaml
# url
https://api.example.com/graphql
# document
query getMovieById($movieId: ID!) {
  movie(id: $movieId) {
    title
    director {
      name
    }
  }
}
# variables
movieId: "123"
```

**Example: Mutation** This example creates a new movie.

```yaml
# url
https://api.example.com/graphql
# document
mutation createMovie($title: String!, $year: Int!) {
  createMovie(title: $title, releaseYear: $year) {
    id
    title
  }
}
# variables
title: My New Movie
year: 2025
```

**Example: Query with Authentication** This example sends an `Authorization` header with a Bearer token.

```yaml
# url
https://api.example.com/graphql
# document
query {
  myPrivateData {
    secretInfo
  }
}
# headers
Authorization: Bearer my-secret-auth-token
```

**Output** The data payload returned by the GraphQL API in response to the query or mutation.
