const convertOlympicsData = (csvData) => {
    return csvData.flatMap(row => {
      // Create a proper date object for the year
      const date = `${row.year}-01-01`;
      
      return [
        {
          date,
          name: "Male Athletes",
          category: "Athletes",
          value: parseInt(row.maleCount)
        },
        {
          date,
          name: "Female Athletes",
          category: "Athletes",
          value: parseInt(row.femaleCount)
        }
      ];
    });
  };

  export default convertOlympicsData;
