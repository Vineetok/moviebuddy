// frontend/src/pages/Admin/Reports.jsx
import React, { useState } from "react";
import { useGetMoviesReportQuery } from "../../redux/api/movies";

const Reports = () => {
  const { data: report, isLoading, error } = useGetMoviesReportQuery();
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Handle changes for filters
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Filter the report based on selected year and month (if provided)
  const filteredReport = report?.filter((item) => {
    let match = true;
    if (selectedYear) match = match && (item._id.year.toString() === selectedYear);
    if (selectedMonth) match = match && (item._id.month.toString() === selectedMonth);
    return match;
  });

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Movies Report</h1>
      <div className="mb-4">
        <label className="mr-2">Year:</label>
        <input 
          type="text" 
          placeholder="Enter Year" 
          value={selectedYear}
          onChange={handleYearChange}
          className="border p-1 text-black"
        />
        <label className="ml-4 mr-2">Month:</label>
        <input 
          type="text" 
          placeholder="Enter Month (1-12)" 
          value={selectedMonth}
          onChange={handleMonthChange}
          className="border p-1 text-black"
        />
      </div>
      {isLoading && <div>Loading report...</div>}
      {error && <div>Error loading report</div>}
      <div>
        {filteredReport && filteredReport.length > 0 ? (
          filteredReport.map((item) => (
            <div key={`${item._id.year}-${item._id.month}`} className="mb-4 border p-4">
              <h2 className="font-bold">
                {item._id.year} - {item._id.month} (Total Movies: {item.count})
              </h2>
              <ul>
                {item.movies.map((movie, idx) => (
                  <li key={idx}>
                    {movie.name} - Genre: {movie.genre}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No data for selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default Reports;
