import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Preload() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [filteredData, setFilteredData] = useState([]);

    // Load filtered data from localStorage when component mounts
    useEffect(() => {
        setFilteredData(JSON.parse(localStorage.getItem("filteredCsvData")) || []);
    }, []);

    const openModal = (template) => {
        setSelectedTemplate(template);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTemplate(null);
    };

    return (
        <div className="min-h-dvh flex flex-col justify-start text-text gap-1 py-24">
            <h1 className="text-3xl font-semibold text-center">
                <span className="italic">Google Sheets</span> columns
            </h1>
            <div className="text-left pt-5 pb-3 px-14 space-y-5">
                {/* Dynamic Template Cards */}
                {filteredData.slice(0, 5).map((row, index) => (
                    <div
                        key={index}
                        className="flex items-center bg-primary/50 rounded-xl px-5 py-3 hover:bg-primary cursor-pointer"
                        onClick={() => openModal(row)}
                    > 
                        <div className="flex flex-col w-4/5">
                            <span className="text-sm">name</span>
                            <span className="text-lg truncate font-bold">{row.idName || "Unnamed"}</span>
                        </div>
                        <div className="w-1/5 flex justify-center">
                            <svg width="22" height="8" viewBox="0 0 22 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.37 7.25C16.67 6.61 16.96 6.05 17.24 5.57C17.54 5.09 17.83 4.69 18.11 4.37H0.62V3.11H18.11C17.83 2.77 17.54 2.36 17.24 1.88C16.96 1.4 16.67 0.849999 16.37 0.229999H17.42C18.68 1.69 20 2.77 21.38 3.47V4.01C20 4.69 18.68 5.77 17.42 7.25H16.37Z" fill="#9AA6B2"/>
                            </svg>
                        </div>
                    </div>
                ))}

                {isModalOpen && selectedTemplate && (
                    <div className="fixed inset-0 bg-black/50 z-10 flex items-center justify-center">
                        <div className="bg-background rounded-xl shadow-lg w-80">
                            <div className="px-7 pt-6 pb-3 space-y-1">
                                {Object.entries(selectedTemplate)
                                    .filter(([key]) => key !== "checkList") 
                                    .map(([key, value]) => (
                                        <div key={key} className="flex flex-col">
                                            <span className="text-md">{key === "idName" ? "name" : key}</span>
                                            <span className="text-2xl truncate font-bold">{value || "N/A"}</span>
                                        </div>
                                    ))}
                            </div>
                            <button 
                                className="w-full bg-primary text-text text-xl border-t-2 border-secondary font-bold py-4 rounded-b-xl hover:bg-primary/80 cursor-pointer"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="text-center px-14 space-y-3">
                <p className="text-sm font-medium opacity-50">Only the first 5 rows have been loaded</p>
                <p className="text-2xl font-medium italic">Has the data been loaded correctly?</p>
            </div>
            <div className="flex justify-center">
                <div className="fixed bottom-5 w-5/6 md:1/6 grid grid-cols-2 gap-5">
                    <Link
                        to="/loading"
                        className="text-center bg-primary text-text py-5 text-2xl rounded-xl font-semibold hover:bg-secondary cursor-pointer"
                    >
                        Return
                    </Link>
                    <Link
                        to="/list"
                        className="text-center bg-primary text-text py-5 text-2xl rounded-xl font-semibold hover:bg-secondary cursor-pointer"
                    >
                        Continue
                    </Link>
                </div>
            </div>
        </div>
    );
}
  
export default Preload;