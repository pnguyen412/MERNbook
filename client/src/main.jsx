import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchBooks from './pages/SearchBooks'
import SavedBooks from './pages/SavedBooks'


const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          {/* <Switch> */}
            <Route exact path="/" component={SearchBooks} />
            <Route exact path="/saved" component={SavedBooks} />
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          {/* </Switch> */}
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//     errorElement: <h1 className='display-2'>Wrong page!</h1>,
//     children: [
//       {
//         index: true,
//         element: <SearchBooks />
//       }, {
//         path: '/saved',
//         element: <SavedBooks />
//       }
//     ]
//   }
// ])

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <RouterProvider router={router} />
// )
