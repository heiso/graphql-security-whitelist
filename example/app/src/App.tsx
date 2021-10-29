import { gql, useQuery } from '@apollo/client'
import React from 'react'
import './App.css'

const BOOKS = gql`
  query getBooks {
    books {
      title
      author {
        fullname
      }
    }
  }
`

function App() {
  const { loading, error, data } = useQuery(BOOKS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div className="App">
      <header className="App-header">
        <ul>
          {data.books.map((book, index) => (
            <li key={index}>
              {book.title} - {book.author.fullname}
            </li>
          ))}
        </ul>
      </header>
    </div>
  )
}

export default App
