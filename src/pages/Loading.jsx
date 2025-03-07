import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Loading() {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [selectedFirstName, setSelectedFirstName] = useState("");
  const [selectedLastName, setSelectedLastName] = useState("");
  const [selectedColumns, setSelectedColumns] = useState({});
  const [headers, setHeaders] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("csvData"));
    if (storedData?.length) {
      setHeaders(Object.keys(storedData[0]).map(header => header.toLowerCase()));
    }
  }, []);

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
    setSelectedName("");
    setSelectedFirstName("");
    setSelectedLastName("");
    setErrors((prev) => {
      const { selectedName, selectedFirstName, selectedLastName, ...rest } = prev;
      return rest;
    });
  };

  const handleColumnSelection = (column) => {
    setSelectedColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const isColumnSelectedForName = (column) =>
    [selectedName, selectedFirstName, selectedLastName].includes(column);

  const handleSubmit = () => {
    const newErrors = {};

    if (!isChecked && !selectedName) newErrors.selectedName = true;
    if (isChecked) {
      if (!selectedFirstName) newErrors.selectedFirstName = true;
      if (!selectedLastName) newErrors.selectedLastName = true;
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const originalData = JSON.parse(localStorage.getItem("csvData")) || [];
    const selectedColumnNames = Object.keys(selectedColumns)
      .filter((col) => selectedColumns[col] && col !== selectedName && col !== selectedFirstName && col !== selectedLastName);
      
    const filteredData = originalData.map((row) => {
      const newRow = {
        idName: isChecked
          ? `${row[selectedFirstName] || ""} ${row[selectedLastName] || ""}`.trim()
          : row[selectedName] || "",
      };
      
      selectedColumnNames.forEach((col) => {
        let value = row[col];
        if (value === "TRUE") value = "Yes";
        if (value === "FALSE") value = "No";
        newRow[col] = value;
      });
      
      newRow.checkList = false;
      return newRow;
    });

    localStorage.setItem("filteredCsvData", JSON.stringify(filteredData));
    navigate("/preload");
  };

  return (
    <>
      <div className="min-h-dvh flex flex-col justify-start text-text gap-1 py-24">
        <h1 className="text-3xl font-semibold text-center">
          <span className="italic">Google Sheets</span> columns
        </h1>
        <div className="text-left py-5 px-14 space-y-5">
          {Object.keys(errors).length > 0 && (
            <p className="text-red-400 text-lg font-semibold">
              Please fill out all required fields
            </p>
          )}

          <div>
            <p className="text-2xl font-medium">Name</p>
            <label className="text-base flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="w-6 h-6 cursor-pointer"
              />
              <span>separate columns <span className="text-sm">(first & last name)</span></span>
            </label>

            {!isChecked ? (
              <div className="relative">
                <select
                  value={selectedName}
                  onChange={(e) => setSelectedName(e.target.value)}
                  className={`w-full border-2 rounded-lg py-2 px-4 text-xl bg-background text-text mt-2 appearance-none cursor-pointer ${
                    errors.selectedName ? "border-red-400" : "border-secondary"
                  }`}
                >
                  <option value="">Choose</option>
                  {headers.map((header, index) => (
                    <option key={index} value={header}>{header}</option>
                  ))}
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-7 w-7 absolute top-4.5 right-2.5 text-text"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" /></svg>
              </div>
            ) : (
              [
                ["first name", selectedFirstName, setSelectedFirstName, "selectedFirstName"],
                ["last name", selectedLastName, setSelectedLastName, "selectedLastName"],
              ].map(([label, value, setter, errorKey]) => (
                <div key={label} className="relative">
                  <label className="text-sm">{label}</label>
                  <select
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className={`w-full border-2 rounded-lg py-2 px-4 text-xl text-text appearance-none cursor-pointer ${
                      errors[errorKey] ? "border-red-400" : "border-secondary"
                    }`}
                  >
                    <option value="">Choose</option>
                    {headers.map((header, index) => (
                      <option key={index} value={header}>{header}</option>
                    ))}
                  </select>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-7 w-7 absolute bottom-2.5 right-2.5 text-text"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" /></svg>
                </div>
              ))
            )}
          </div>

          <div>
            <p className="text-2xl font-medium">All columns <span className="text-sm">(check columns to keep)</span></p>
            <div className="grid grid-cols-1 gap-4">
              {headers.map((header, index) => (
                <button
                  key={index}
                  className={`border-2 rounded-lg p-4 flex items-center justify-between hover:bg-primary/80 border-secondary cursor-pointer ${
                    selectedColumns[header] || isColumnSelectedForName(header) ? "bg-primary" : "bg-background"
                  }`}
                  onClick={() => handleColumnSelection(header)}
                >
                  <span className="text-xl">{header}</span>
                  <input
                    type="checkbox"
                    checked={selectedColumns[header] || isColumnSelectedForName(header)}
                    disabled={isColumnSelectedForName(header)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => handleColumnSelection(header)}
                    className="w-5 h-5 border-2 border-secondary rounded cursor-pointer"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="fixed bottom-0 w-full text-center bg-primary text-text py-5 text-2xl font-semibold border-t-2 border-secondary hover:bg-primary/80 cursor-pointer"
      >
        Preload data
      </button>
    </>
  );
}

export default Loading;