import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

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
      const response = await axios.get("http://127.0.0.1:4000/all_movies", {
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
      const response = await axios.post("http://127.0.0.1:4000/ask_model", 
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
      // data.concat(selection, recommendation)
      // console.log("Response, ", response.data)
      // console.log("Data, ", data)
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

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    if(query === ''){
      fetchAllItems()
    } else {
      fetchSearchItems(query)
    }
 
  };

  const defineAnswerType = (item) => {
    if(item.is_answer === true){
      return 'Suited'
    } else if (item.is_answer === false){
      return 'Recommended for You'
    }
    else {
      return ''
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
      <h1>Recask</h1>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search items..."
        />
        <button type="submit">Search</button>
      </form>

      {/* Loading Indicator */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {/* Item List */}
          <div className="item-list">
            {displayItems.length === 0 ? (
              <p>No items found.</p>
            ) : (
              displayItems.map((item) => (
                <div key={item.id} className="item-card">
                  <h3>{item.title}</h3>
                  <p>{item.release_date}</p>
                  <p>{defineAnswerType(item)}</p>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
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
