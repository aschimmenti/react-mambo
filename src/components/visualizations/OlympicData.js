import * as d3 from 'd3';

export const processOlympicData = (csvData) => {
  return csvData.flatMap(row => [
    {
      year: parseInt(row.year),
      name: "Male Athletes",
      value: parseInt(row.maleCount),
      category: "male",
      total: parseInt(row.total)
    },
    {
      year: parseInt(row.year),
      name: "Female Athletes",
      value: parseInt(row.femaleCount),
      category: "female",
      total: parseInt(row.total)
    }
  ]);
};

export const calculatePercentages = (data) => {
  return data.map(row => ({
    ...row,
    percentage: (row.value / row.total) * 100
  }));
};