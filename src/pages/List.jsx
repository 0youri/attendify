import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { clearCsvData } from "../utils/storage";

function List() {
  const navigate = useNavigate();

  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUncheckedOnly, setShowUncheckedOnly] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Load data from localStorage on mount and sort it
  useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem("filteredCsvData")) || [];
      setFilteredData(sortData(storedData));
  }, []);

  // Sorting function
  const sortData = (data) => 
      [...data].sort((a, b) =>
          (Number(a.checkList) - Number(b.checkList)) || 
          new Intl.Collator(undefined, { numeric: true, sensitivity: "base" }).compare(a.idName || "", b.idName || "")
      );

  // Open modal
  const openModal = (item) => setSelectedItem(item);

  // Close modal
  const closeModal = () => setSelectedItem(null);

  // Toggle checkList status
  const toggleCheck = () => {
      if (!selectedItem) return;

      const updatedData = filteredData.map((row) =>
          row === selectedItem ? { ...row, checkList: !row.checkList } : row
      );
      const sortedData = sortData(updatedData);

      setFilteredData(sortedData);
      localStorage.setItem("filteredCsvData", JSON.stringify(sortedData));
      closeModal();
  };

  // Filter data based on search query
  const filteredList = useMemo(() =>
      filteredData.filter((row) =>
          row.idName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (!showUncheckedOnly || !row.checkList)
      ),
      [filteredData, searchQuery, showUncheckedOnly]
  );

  return (
    <div className="min-h-dvh flex flex-col justify-start text-text gap-1">
      <div className="py-24 px-14">
        {/* Search Bar Body */}
        <div>
          {/* Title */}
          <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-left">List</h1>
              <label className="flex items-center space-x-1 cursor-pointer">
                <span className="text-sm font-medium">unchecked only</span>
                <input
                    type="checkbox"
                    checked={showUncheckedOnly}
                    onChange={() => setShowUncheckedOnly(!showUncheckedOnly)}
                    className="w-4 h-4 cursor-pointer"
                />
              </label>
          </div>
          {/* Search Bar */}
          <input
              type="text"
              placeholder="search bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 rounded-lg py-1 px-3 text-xl text-text border-secondary"
          />
        </div>

        {/* Data List */}
        <div className="text-left py-5 space-y-5">
            {filteredList.map((row, index) => (
                <div
                    key={index}
                    className={`flex items-center rounded-lg px-5 py-3 cursor-pointer 
                        ${row.checkList ? "bg-primary-green hover:bg-primary-green/75" : "bg-primary/50 hover:bg-primary"}`}
                    onClick={() => openModal(row)}
                >
                    <div className="flex flex-col w-4/5">
                        <span className="text-sm">name</span>
                        <span className="text-lg truncate font-bold">{row.idName || "Unnamed"}</span>
                    </div>
                    <div className="w-1/5 flex justify-center cursor-pointer">
                        <svg width="22" height="8" viewBox="0 0 22 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.37 7.25C16.67 6.61 16.96 6.05 17.24 5.57C17.54 5.09 17.83 4.69 18.11 4.37H0.62V3.11H18.11C17.83 2.77 17.54 2.36 17.24 1.88C16.96 1.4 16.67 0.849999 16.37 0.229999H17.42C18.68 1.69 20 2.77 21.38 3.47V4.01C20 4.69 18.68 5.77 17.42 7.25H16.37Z" fill="#9AA6B2"/>
                        </svg>
                    </div>
                </div>
            ))}
        </div>

        {/* Modal */}
        {selectedItem && (
            <div className="fixed inset-0 bg-black/50 z-10 flex items-center justify-center">
                <div className="bg-background rounded-xl shadow-lg w-80">
                    <div className="px-7 pt-6 pb-3 space-y-1">
                        {Object.entries(selectedItem)
                            .filter(([key]) => key !== "checkList")
                            .map(([key, value]) => (
                                <div key={key} className="flex flex-col">
                                    <span className="text-md">{key === "idName" ? "name" : key}</span>
                                    <span className="text-2xl truncate font-bold">{value || "N/A"}</span>
                                </div>
                            ))}
                    </div>

                    <div className="flex border-t-2 border-secondary">
                        <button
                            className="w-full bg-primary text-text text-xl border-r border-secondary font-bold py-4 rounded-bl-xl hover:bg-primary/80 cursor-pointer"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                        <button
                            className="w-full text-text text-xl border-l border-secondary rounded-br-xl font-bold py-4 cursor-pointer bg-primary hover:bg-primary/80"
                            onClick={toggleCheck}
                        >
                            {selectedItem.checkList ? "Uncheck" : "Check"}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
      <button
        className="fixed bottom-0 w-full text-center bg-primary text-text py-4 text-2xl font-semibold border-t-2 border-secondary hover:bg-secondary cursor-pointer"
        onClick={() => setShowConfirmModal(true)}
      >
        Done
      </button>
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-20 flex items-center justify-center">
            <div className="bg-background rounded-xl shadow-lg w-80 p-6 space-y-5">
                <h2 className="text-xl font-bold text-center">Confirm?</h2>
                <p className="text-md text-center">This will clear all data.</p>

                <div className="flex gap-4">
                    <button
                        className="w-1/2 bg-primary text-text py-3 rounded-lg font-semibold hover:bg-primary/80 cursor-pointer"
                        onClick={() => setShowConfirmModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="w-1/2 bg-red-400 text-white py-3 rounded-lg font-semibold hover:bg-red-300 cursor-pointer"
                        onClick={() => {
                            clearCsvData();
                            navigate("/");
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default List;
