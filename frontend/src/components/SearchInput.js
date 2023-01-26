import React, { useState, useEffect } from "react";
import { useSearchPostQuery } from "../Features/posts/postsApiSlice";
import { useSearchTagQuery } from "../Features/tags/tagsApiSlice";
import { useSearchUserQuery } from "../Features/users/usersApiSlice";

const SearchInput = ({ selectedFilter, getSearchResults }) => {
  const [searchText, setSearchText] = useState("");
  const [skip, setSkip] = useState(true);

  let fetchedResults;

  if (selectedFilter === "type-post") {
    fetchedResults = useSearchPostQuery(searchText, { skip });
  } else if (selectedFilter === "type-tag") {
    fetchedResults = useSearchTagQuery(searchText, { skip });
  } else if (selectedFilter === "type-user") {
    fetchedResults = useSearchUserQuery(searchText, { skip });
  } else {
    fetchedResults = useSearchPostQuery(searchText, { skip });
  }

  const { data: searchResults, isSuccess, isLoading } = fetchedResults;

  const handleInputChange = (event) => {
    setSearchText(() => event.target.value);
    if (!searchText.length || isLoading) {
      setSkip(() => true);
    } else {
      setSkip(() => false);
    }
  };

  useEffect(() => {
    if (searchResults) {
      getSearchResults(searchResults);
    } else if (!searchText.length) {
      getSearchResults({});
    }
  }, [isSuccess, searchText]);

  return (
    <div className='search-form'>
      <input
        type='search'
        value={searchText}
        placeholder={selectedFilter === "type-tag" ? "Search Tags" : "Search"}
        className='search-input'
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchInput;
