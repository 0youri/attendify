import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { fetchGoogleSheetsData } from "../utils/fetchGoogleSheetsData"; // ✅ Import utils function

function Load() {
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  // Check if the link follows the correct Google Sheets CSV format
  const isValidGoogleSheetsCSV = (url) =>
    /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[^/]+\/.*output=csv$/.test(url);

  // Check if the link is accessible
  const checkLinkAccessibility = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!link.trim()) return setError("Please enter a link.");
    if (!isValidGoogleSheetsCSV(link)) return setError("Invalid link format. Make sure it ends with output=csv.");

    setIsChecking(true);
    const isAccessible = await checkLinkAccessibility(link);

    if (!isAccessible) {
      setError("The link is not accessible. Make sure it is shared correctly.");
      setIsChecking(false);
      return;
    }

    localStorage.setItem("csvUrl", link);
    let data = await fetchGoogleSheetsData(link);
    
    // Convert all headers to lowercase
    data = data.map(row => 
      Object.fromEntries(Object.entries(row).map(([key, value]) => [key.toLowerCase(), value]))
    );
    
    localStorage.setItem("csvData", JSON.stringify(data));
    setIsChecking(false);
    navigate("/loading");
  };


  return (
    <div className="min-h-dvh flex flex-col justify-center md:items-center text-text gap-1">
      <div className="px-14 md:px-0 space-y-1">
        <p className="text-3xl font-semibold text-left">
          Fill your<br/>
          <span className="italic">Google Sheets</span> link<br/>
          here ↓
        </p>
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          type="text"
          placeholder="https://docs.google.com/..." 
          className={`w-full border-2 rounded-lg py-2 px-4 text-2xl text-text ${error ? "border-red-400" : "border-secondary"}`}
        />
        
        {error && <p className="text-red-400 font-medium">{error}</p>}
        <a
          href="https://support.google.com/docs/answer/183965"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text hover:underline font-medium flex items-center gap-1 mt-2"
        >
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>
          <span>How to publish Google Sheets as CSV</span>
        </a>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isChecking}
          className={`fixed bottom-5 min-w-1/2 md:min-w-1/5 text-center text-text py-5 text-2xl rounded-xl font-semibold cursor-pointer 
            ${isChecking ? "bg-gray-500 cursor-not-allowed" : "bg-primary hover:bg-secondary"}`}
        >
          {isChecking ? "Checking..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
  
export default Load;
