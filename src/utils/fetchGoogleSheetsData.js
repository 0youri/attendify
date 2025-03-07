export const fetchGoogleSheetsData = async (csvUrl) => {
    try {
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch data. Make sure the link is public.");
      }
  
      const csvText = await response.text();
      const rows = csvText.split("\n").map(row => row.split(","));
  
      const headers = rows[0];
      const data = rows.slice(1).map(row =>
        headers.reduce((acc, key, index) => {
          acc[key.trim()] = row[index]?.trim();
          return acc;
        }, {})
      );
  
      return data;
    } catch (error) {
      console.error("Error fetching Google Sheets data:", error);
      return [];
    }
  };