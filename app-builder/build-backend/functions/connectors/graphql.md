# GraphQL

The GraphQL connector interacts with GraphQL APIs. It provides a single static function to send queries or mutations to an endpoint and retrieve the results. Since the function is static, you need no instance.

### `request`

Sends a query or a mutation to a GraphQL API endpoint.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td>The endpoint URL of the GraphQL API.</td><td>string</td></tr><tr><td><code>document</code></td><td>The GraphQL query or mutation, written in standard GraphQL syntax.</td><td>string</td></tr><tr><td><code>variables</code></td><td>Optional variables required by the document.</td><td>object</td></tr><tr><td><code>headers</code></td><td>Optional request headers as key-value pairs, commonly used for authentication.</td><td>object</td></tr></tbody></table>

{% hint style="info" %}
Right-click the `headers` input and mark it as a secret to mask tokens or credentials.
{% endhint %}

#### Examples

Example 1: Simple query

This queries a list of movies.

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

Example 2: Query with variables

This fetches a single movie by its ID, passed as a variable.

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

Example 3: Mutation

This creates a new movie.

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

Example 4: Query with authentication

This sends an `Authorization` header with a Bearer token.

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

#### Output

The data payload returned by the GraphQL API. Throws an error if the request fails or the API returns errors.
