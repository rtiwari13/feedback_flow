import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setAnswer(data.answer || "No answer returned.");
    } catch (err) {
      setError("Failed to fetch answer.");
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <div className="bg-[#191919] text-white min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-6">Ask me a question 🐼 </h1>

        <form onSubmit={handleSubmit} className="flex items-center gap-4 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
            className="flex-grow bg-[#2a2a2a] text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </form>

        {error && (
          <p className="text-red-400 mb-4">
            <strong>Error:</strong> {error}
          </p>
        )}

        {answer && (
          <p className="text-lg animate-fade-in">
            <strong>Answer ✨</strong> {answer}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;

