import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSearchPostQuery } from "../Features/posts/postsApiSlice";
import { useSearchTagQuery } from "../Features/tags/tagsApiSlice";
import { useSearchUserQuery } from "../Features/users/usersApiSlice";
import SearchInput from "./SearchInput";

//Searching by tags should also dislpay posts with the tags. See lamadev Query tuto on youtube tuto
const SearchBar = () => {
  //! Cosmetic
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const searchBarRef = useRef(null);

  const handleFilterClick = (filter) => {
    if (selectedFilter === filter) {
      setSelectedFilter(null);
    } else {
      setSelectedFilter(filter);
    }
  };

  const handleClickOutside = (event) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
      setSelectedFilter(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  //! Search Results

  const [searchResults, setSearchResults] = useState({});

  const getSearchResults = (result) => {
    setSearchResults(result);
  };

  let content = null;

  if (searchResults) {
    const { ids, entities } = searchResults;
    if (selectedFilter === "type-tag") {
      content = ids?.length
        ? ids.map((resultId) => {
            return (
              <Link className='dataItem' key={resultId} to={`/tag/${resultId}`}>
                <p>{entities[resultId].name}</p>
              </Link>
            );
          })
        : null;
    } else if (selectedFilter === "type-user") {
      content = ids?.length
        ? ids.map((resultId) => {
            return (
              <Link className='dataItem' key={resultId} to={`/user/${resultId}`}>
                <p>{entities[resultId].username}</p>
              </Link>
            );
          })
        : null;
    } else {
      content = ids?.length
        ? ids.map((resultId) => {
            return (
              <Link className='dataItem' key={resultId} to={`/post/${resultId}`}>
                <p>{entities[resultId].title}</p>
              </Link>
            );
          })
        : null;
    }
  }

  return (
    <form
      ref={searchBarRef}
      className={`search-form${isFocused ? " focus" : ""}`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}>
      <button className='search-button'>
        <svg width='20' height='20' viewBox='0 0 0.8 0.8' xmlns='http://www.w3.org/2000/svg'>
          <path d='M.763.737.502.476A.268.268 0 1 0 .299.57H.3A.269.269 0 0 0 .476.503l.261.261A.02.02 0 0 0 .75.77C.76.77.769.762.769.751A.016.016 0 0 0 .763.738zM.069.3A.231.231 0 1 1 .3.531.231.231 0 0 1 .069.3z' />
        </svg>
      </button>
      <SearchInput selectedFilter={selectedFilter} getSearchResults={getSearchResults} />
      <div className='filters'>
        <button
          type='button'
          className={`filter ${selectedFilter === "type-post" ? "selected" : ""}`}
          onClick={() => handleFilterClick("type-post")}>
          <svg
            viewBox='0 0 4 4'
            style={{
              fill: selectedFilter === "type-post" ? "red" : "#121212",
              fillRule: "evenodd",
              clipRule: "evenodd",
              strokeLinejoin: "round",
              strokeMiterlimit: 2,
            }}
            xmlSpace='preserve'
            xmlns='http://www.w3.org/2000/svg'>
            <path d='M3.75 1.125c0 -0.1 -0.04 -0.195 -0.11 -0.265A0.374 0.374 0 0 0 3.375 0.75H0.625c-0.1 0 -0.195 0.04 -0.265 0.11A0.374 0.374 0 0 0 0.25 1.125v1.75c0 0.1 0.04 0.195 0.11 0.265A0.374 0.374 0 0 0 0.625 3.25h2.75c0.1 0 0.195 -0.04 0.265 -0.11A0.374 0.374 0 0 0 3.75 2.875V1.125Zm-1.875 0.25 0 1.248a0.125 0.125 0 0 0 0.25 0L2.125 1.375a0.125 0.125 0 0 0 -0.25 0Zm0.5 0.25v0.75a0.125 0.125 0 0 0 0.25 0v-0.75a0.125 0.125 0 0 0 -0.25 0Zm-1 0v0.75a0.125 0.125 0 0 0 0.25 0v-0.75a0.125 0.125 0 0 0 -0.25 0Zm1.5 0.25v0.248a0.125 0.125 0 0 0 0.25 0V1.875a0.125 0.125 0 0 0 -0.25 0ZM0.875 1.875v0.248a0.125 0.125 0 0 0 0.25 0V1.875a0.125 0.125 0 0 0 -0.25 0Z' />
          </svg>
          <span>Post</span>
        </button>
        <button
          type='button'
          className={`filter ${selectedFilter === "type-tag" ? "selected" : ""}`}
          onClick={() => handleFilterClick("type-tag")}>
          <svg
            viewBox='0 0 3 3'
            style={{
              fill: selectedFilter === "type-tag" ? "red" : "#121212",
              fillRule: "evenodd",
              clipRule: "evenodd",
              strokeLinejoin: "round",
              strokeMiterlimit: 2,
            }}
            xmlSpace='preserve'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M1 1H1.001M0.25 0.65L0.25 1.209C0.25 1.27 0.25 1.301 0.257 1.33C0.263 1.355 0.273 1.38 0.287 1.402C0.302 1.427 0.324 1.449 0.367 1.492L1.326 2.451C1.474 2.599 1.548 2.674 1.634 2.701C1.709 2.726 1.791 2.726 1.866 2.701C1.952 2.674 2.026 2.599 2.174 2.451L2.451 2.174C2.599 2.026 2.674 1.952 2.701 1.866C2.726 1.791 2.726 1.709 2.701 1.634C2.674 1.548 2.599 1.474 2.451 1.326L1.492 0.367C1.449 0.324 1.427 0.302 1.402 0.287C1.38 0.273 1.355 0.263 1.33 0.257C1.301 0.25 1.27 0.25 1.209 0.25L0.65 0.25C0.51 0.25 0.44 0.25 0.387 0.277C0.339 0.301 0.301 0.339 0.277 0.387C0.25 0.44 0.25 0.51 0.25 0.65ZM1.063 1C1.063 1.035 1.035 1.063 1 1.063C0.965 1.063 0.938 1.035 0.938 1C0.938 0.965 0.965 0.938 1 0.938C1.035 0.938 1.063 0.965 1.063 1Z'
              width='20'
              height='20'
            />
          </svg>
          <span>Tag</span>
        </button>
        <button
          type='button'
          className={`filter ${selectedFilter === "type-user" ? "selected" : ""}`}
          onClick={() => handleFilterClick("type-user")}>
          <svg
            viewBox='0 0 24 24'
            style={{
              fill: selectedFilter === "type-user" ? "red" : "#121212",
              fillRule: "evenodd",
              clipRule: "evenodd",
              strokeLinejoin: "round",
              strokeMiterlimit: 2,
            }}
            xmlSpace='preserve'
            xmlns='http://www.w3.org/2000/svg'>
            <path d='M20 21c0-1.396 0-2.093-.172-2.661a4 4 0 0 0-2.667-2.667c-.568-.172-1.265-.172-2.661-.172h-5c-1.396 0-2.093 0-2.661.172a4 4 0 0 0-2.667 2.667C4 18.907 4 19.604 4 21M16.5 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z' />
          </svg>
          <span>User</span>
        </button>
      </div>
      <div className='dataResult'>{content}</div>
    </form>
  );
};

export default SearchBar;

// import React, { useState, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useSearchPostQuery } from "../Features/posts/postsApiSlice";
// import { useSearchTagQuery } from "../Features/tags/tagsApiSlice";
// import { useSearchUserQuery } from "../Features/users/usersApiSlice";

// //Searching by tags should also dislpay posts with the tags. See lamadev Query tuto on youtube tuto
// const SearchBar = () => {
//   //! Cosmetic
//   const [selectedFilter, setSelectedFilter] = useState(null);
//   const [isFocused, setIsFocused] = useState(false);
//   const searchBarRef = useRef(null);

//   const handleFilterClick = (filter) => {
//     if (selectedFilter === filter) {
//       setSelectedFilter(null);
//     } else {
//       setSelectedFilter(filter);
//     }
//   };

//   const handleClickOutside = (event) => {
//     if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
//       setSelectedFilter(null);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   });

//   //! Search

//   const [searchText, setSearchText] = useState("");
//   const [skip, setSkip] = useState(true);

//   let fetchedResults;

//   if (selectedFilter === "type-post") {
//     fetchedResults = useSearchPostQuery(searchText, { skip });
//   } else if (selectedFilter === "type-tag") {
//     fetchedResults = useSearchTagQuery(searchText, { skip });
//   } else if (selectedFilter === "type-user") {
//     fetchedResults = useSearchUserQuery(searchText, { skip });
//   } else {
//     fetchedResults = useSearchPostQuery(searchText, { skip });
//   }

//   const { data: searchResults, isSuccess, isLoading } = fetchedResults;

//   const handleInputChange = (event) => {
//     setSearchText(() => event.target.value);
//     if (!searchText.length || isLoading) {
//       setSkip(() => true);
//     } else {
//       setSkip(() => false);
//     }
//   };

//   let content = null;

//   if (isSuccess) {
//     const { ids, entities } = searchResults;
//     if (selectedFilter === "type-tag") {
//       content = ids?.length
//         ? ids.map((resultId) => {
//             return (
//               <Link className='dataItem' key={resultId} to={`/tag/${resultId}`}>
//                 <p>{entities[resultId].name}</p>
//               </Link>
//             );
//           })
//         : null;
//     } else if (selectedFilter === "type-user") {
//       content = ids?.length
//         ? ids.map((resultId) => {
//             return (
//               <Link className='dataItem' key={resultId} to={`/user/${resultId}`}>
//                 <p>{entities[resultId].username}</p>
//               </Link>
//             );
//           })
//         : null;
//     } else {
//       content = ids?.length
//         ? ids.map((resultId) => {
//             return (
//               <Link className='dataItem' key={resultId} to={`/post/${resultId}`}>
//                 <p>{entities[resultId].title}</p>
//               </Link>
//             );
//           })
//         : null;
//     }
//   }

//   return (
//     <form
//       ref={searchBarRef}
//       className={`search-form${isFocused ? " focus" : ""}`}
//       onFocus={() => setIsFocused(true)}
//       onBlur={() => setIsFocused(false)}>
//       <button className='search-button'>
//         <svg width='20' height='20' viewBox='0 0 0.8 0.8' xmlns='http://www.w3.org/2000/svg'>
//           <path d='M.763.737.502.476A.268.268 0 1 0 .299.57H.3A.269.269 0 0 0 .476.503l.261.261A.02.02 0 0 0 .75.77C.76.77.769.762.769.751A.016.016 0 0 0 .763.738zM.069.3A.231.231 0 1 1 .3.531.231.231 0 0 1 .069.3z' />
//         </svg>
//       </button>
//       {/* SEARCH INPUT -----  */}
//       <input
//         type='search'
//         value={searchText}
//         placeholder='Search'
//         className='search-input'
//         onChange={handleInputChange}
//       />
//       <div className='filters'>
//         <button
//           type='button'
//           className={`filter ${selectedFilter === "type-post" ? "selected" : ""}`}
//           onClick={() => handleFilterClick("type-post")}>
//           <svg
//             viewBox='0 0 4 4'
//             style={{
//               fill: selectedFilter === "type-post" ? "red" : "#121212",
//               fillRule: "evenodd",
//               clipRule: "evenodd",
//               strokeLinejoin: "round",
//               strokeMiterlimit: 2,
//             }}
//             xmlSpace='preserve'
//             xmlns='http://www.w3.org/2000/svg'>
//             <path d='M3.75 1.125c0 -0.1 -0.04 -0.195 -0.11 -0.265A0.374 0.374 0 0 0 3.375 0.75H0.625c-0.1 0 -0.195 0.04 -0.265 0.11A0.374 0.374 0 0 0 0.25 1.125v1.75c0 0.1 0.04 0.195 0.11 0.265A0.374 0.374 0 0 0 0.625 3.25h2.75c0.1 0 0.195 -0.04 0.265 -0.11A0.374 0.374 0 0 0 3.75 2.875V1.125Zm-1.875 0.25 0 1.248a0.125 0.125 0 0 0 0.25 0L2.125 1.375a0.125 0.125 0 0 0 -0.25 0Zm0.5 0.25v0.75a0.125 0.125 0 0 0 0.25 0v-0.75a0.125 0.125 0 0 0 -0.25 0Zm-1 0v0.75a0.125 0.125 0 0 0 0.25 0v-0.75a0.125 0.125 0 0 0 -0.25 0Zm1.5 0.25v0.248a0.125 0.125 0 0 0 0.25 0V1.875a0.125 0.125 0 0 0 -0.25 0ZM0.875 1.875v0.248a0.125 0.125 0 0 0 0.25 0V1.875a0.125 0.125 0 0 0 -0.25 0Z' />
//           </svg>
//           <span>Post</span>
//         </button>
//         <button
//           type='button'
//           className={`filter ${selectedFilter === "type-tag" ? "selected" : ""}`}
//           onClick={() => handleFilterClick("type-tag")}>
//           <svg
//             viewBox='0 0 3 3'
//             style={{
//               fill: selectedFilter === "type-tag" ? "red" : "#121212",
//               fillRule: "evenodd",
//               clipRule: "evenodd",
//               strokeLinejoin: "round",
//               strokeMiterlimit: 2,
//             }}
//             xmlSpace='preserve'
//             xmlns='http://www.w3.org/2000/svg'>
//             <path
//               d='M1 1H1.001M0.25 0.65L0.25 1.209C0.25 1.27 0.25 1.301 0.257 1.33C0.263 1.355 0.273 1.38 0.287 1.402C0.302 1.427 0.324 1.449 0.367 1.492L1.326 2.451C1.474 2.599 1.548 2.674 1.634 2.701C1.709 2.726 1.791 2.726 1.866 2.701C1.952 2.674 2.026 2.599 2.174 2.451L2.451 2.174C2.599 2.026 2.674 1.952 2.701 1.866C2.726 1.791 2.726 1.709 2.701 1.634C2.674 1.548 2.599 1.474 2.451 1.326L1.492 0.367C1.449 0.324 1.427 0.302 1.402 0.287C1.38 0.273 1.355 0.263 1.33 0.257C1.301 0.25 1.27 0.25 1.209 0.25L0.65 0.25C0.51 0.25 0.44 0.25 0.387 0.277C0.339 0.301 0.301 0.339 0.277 0.387C0.25 0.44 0.25 0.51 0.25 0.65ZM1.063 1C1.063 1.035 1.035 1.063 1 1.063C0.965 1.063 0.938 1.035 0.938 1C0.938 0.965 0.965 0.938 1 0.938C1.035 0.938 1.063 0.965 1.063 1Z'
//               width='20'
//               height='20'
//             />
//           </svg>
//           <span>Tag</span>
//         </button>
//         <button
//           type='button'
//           className={`filter ${selectedFilter === "type-user" ? "selected" : ""}`}
//           onClick={() => handleFilterClick("type-user")}>
//           <svg
//             viewBox='0 0 24 24'
//             style={{
//               fill: selectedFilter === "type-user" ? "red" : "#121212",
//               fillRule: "evenodd",
//               clipRule: "evenodd",
//               strokeLinejoin: "round",
//               strokeMiterlimit: 2,
//             }}
//             xmlSpace='preserve'
//             xmlns='http://www.w3.org/2000/svg'>
//             <path d='M20 21c0-1.396 0-2.093-.172-2.661a4 4 0 0 0-2.667-2.667c-.568-.172-1.265-.172-2.661-.172h-5c-1.396 0-2.093 0-2.661.172a4 4 0 0 0-2.667 2.667C4 18.907 4 19.604 4 21M16.5 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z' />
//           </svg>
//           <span>User</span>
//         </button>
//       </div>
//       <div className='dataResult'>{isSuccess && content}</div>
//     </form>
//   );
// };

// export default SearchBar;
