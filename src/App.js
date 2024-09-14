import React, { useState, useEffect} from "react";
import axios from "axios";
import "./App.css";
import styles from "./index.module.css";
import CardList from "./CardList";
import Spinner from "./Spinner";

function App() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [displayItems, setDisplayItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;
  

  const fetchAllItems = async () => {
    setIsLoading(true); // Show loading indicator
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/all_movies`, 
        {
        headers: {
          'Content-Type': 'application/json'
        }
        
      });
      let data = response.data.data
      console.log("Success fetch data")
      setDisplayItems(data.slice(0, itemsPerPage))
      setItems(data); // Assuming API returns items in 'items' key
      setTotalPages(Math.ceil(data.length / itemsPerPage)); // Total pages based on totalItems
    } catch (error) {
      console.error("Error fetching data of All Items", error);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  const fetchSearchItems = async (userQuery) => {
    setIsLoading(true); // Show loading indicator
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/ask_model`, 
        {
          // Request Body 
          query: userQuery,
        },
        { 
          // Optional config
         headers: {
            'Content-Type': 'application/json'
          },
        }
    );
      let data = response.data.data
      setItems(data); // Assuming API returns items in 'items' key
      setDisplayItems(data.slice(0, itemsPerPage))
      setTotalPages(Math.ceil(data.length / itemsPerPage)); // Total pages based on totalItems
    } catch (error) {
      console.error("Error fetching data of Searchable Items", error);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  const fetchDisplayItem = async (newPage) => {
    setIsLoading(true); // Show loading indicator
    try {
      setPage(newPage);
      const data = items.slice((newPage-1)*itemsPerPage, newPage*itemsPerPage)
      setDisplayItems(data)
    } catch (error) {
      console.error("Error fetching data of Displayable Items", error);
    } finally {
      setTimeout(()=> setIsLoading(false), 500)
    }
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  // Handle enter key in search form
  const handlePressKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setPage(1); // Reset to first page on new search
      if(query === ''){
        fetchAllItems()
      } else {
        fetchSearchItems(query)
      }
    }
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchDisplayItem(newPage)
  };

  // Fetch initial items on component mount
  useEffect(() => {
    fetchAllItems();
    setPage(1)
    setQuery('')
  }, []);

  return (
    <div className="App">
      <br></br>
      <h1 style={{color: 'white'}}>Recask : Movie Search Features</h1>
      <br></br>
      {/* Search Form */}
      <form onKeyDown={handlePressKey}>
        <input
          className={styles.search}
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search movies..."
        />
      </form> 

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="card-list-container" style = {{alignContent: 'center'}}>
          <Spinner></Spinner>
        </div>
        
      ) : (
        <div>
          <CardList movies={displayItems} />
          {/* Pagination Controls */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="pagination-button"
            >
              Previous
            </button>
            <span style={{color:'white'}}>Page {page} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
