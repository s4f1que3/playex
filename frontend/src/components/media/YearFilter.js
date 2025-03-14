import React, { useState } from 'react';

const YearFilter = ({ selectedYear, onChange }) => {
  const [searchYear, setSearchYear] = useState('');
  const currentYear = new Date().getFullYear();
  
  const handleYearInput = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setSearchYear(value);
  };

  const handleYearSelect = (year) => {
    if (selectedYear === year) {
      onChange(''); // Clear the year if it's already selected
    } else {
      onChange(year);
    }
    setSearchYear(''); // Clear search after selection
  };

  const isValidYear = (year) => {
    return year >= 1900 && year <= currentYear;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchYear && isValidYear(searchYear)) {
      handleYearSelect(searchYear);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={searchYear}
          onChange={handleYearInput}
          onKeyDown={handleKeyDown}
          placeholder="Search year..."
          className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#82BC87] w-2/3"
        />
        {searchYear && isValidYear(searchYear) && (
          <button
            onClick={() => handleYearSelect(searchYear)}
            className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm hover:bg-gray-700 whitespace-nowrap"
          >
            Add {searchYear}
          </button>
        )}
      </div>
      
      {selectedYear && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleYearSelect(selectedYear)}
            className="bg-[#82BC87] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 hover:bg-[#6ea973] transition-colors"
          >
            {selectedYear}
            <span className="ml-1">×</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default YearFilter;
