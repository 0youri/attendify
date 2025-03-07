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
    <div className="min-h-dvh flex flex-col justify-center text-text gap-1">
      <div className="px-14 space-y-1">
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
      </div>
      <button
        onClick={handleSubmit}
        disabled={isChecking}
        className={`fixed bottom-0 w-full text-center py-5 text-2xl font-semibold border-t-2 border-secondary cursor-pointer 
          ${isChecking ? "bg-gray-500 cursor-not-allowed" : "bg-primary hover:bg-primary/80 text-text"}`}
      >
        {isChecking ? "Checking..." : "Submit"}
      </button>
    </div>
  );
}
  
export default Load;
