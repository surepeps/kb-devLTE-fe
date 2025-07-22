"use client";
import { useState } from "react";
import { URLS } from "@/utils/URLS";
import { GET_REQUEST } from "@/utils/requests";

export default function TestArea() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const testAPI = async () => {
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      console.log("Testing API connectivity...");
      console.log("BASE URL:", URLS.BASE);
      
      const apiUrl = `${URLS.BASE}${URLS.fetchBriefs}?briefType=Outright%20Sales&page=1&limit=12`;
      console.log("Full API URL:", apiUrl);
      
      const result = await GET_REQUEST(apiUrl);
      console.log("API Response:", result);
      
      setResponse(result);
    } catch (err: any) {
      console.error("API Test Error:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Area</h1>
      
      <div className="mb-4">
        <p><strong>BASE URL:</strong> {URLS.BASE}</p>
        <p><strong>Fetch Briefs Endpoint:</strong> {URLS.fetchBriefs}</p>
      </div>

      <button
        onClick={testAPI}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test API"}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h3 className="font-bold">Success Response:</h3>
          <pre className="text-sm overflow-auto max-h-64">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
