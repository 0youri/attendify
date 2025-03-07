export const clearCsvData = () => {
    localStorage.removeItem("filteredCsvData");
    localStorage.removeItem("csvUrl");
    localStorage.removeItem("csvData");
};