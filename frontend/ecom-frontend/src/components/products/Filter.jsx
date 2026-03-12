import { useState } from "react";
import { FiSearch, FiArrowUp, FiArrowDown, FiRefreshCw } from "react-icons/fi";

const Filter = ({ categories, onSearch, onCategoryChange, onSort }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleCategory = (e) => {
    const value = e.target.value;
    setCategory(value);
    onCategoryChange(value);
  };

  const toggleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    onSort(newOrder);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("all");
    setSortOrder("asc");
    onSearch("");
    onCategoryChange("all");
    onSort("asc");
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

      {/* SEARCH */}
      <div className="relative w-full lg:w-[350px]">
        <FiSearch className="absolute left-3 top-3 text-gray-500"/>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full border rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex items-center gap-3">

        {/* CATEGORY */}
        <select
          value={category}
          onChange={handleCategory}
          className="border rounded-md px-3 py-2"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryName}>
              {c.categoryName}
            </option>
          ))}
        </select>

        {/* SORT */}
        <button
          onClick={toggleSort}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-md"
        >
          Sort
          {sortOrder === "asc" ? <FiArrowUp /> : <FiArrowDown />}
        </button>

        {/* CLEAR */}
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 bg-gray-700 text-white px-3 py-2 rounded-md"
        >
          <FiRefreshCw />
          Clear
        </button>

      </div>
    </div>
  );
};

export default Filter;