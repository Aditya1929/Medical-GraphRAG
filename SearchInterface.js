'use client';

import { useState } from 'react'

export default function SearchInterface() {
    const [question, setQuestion] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!question.trim()){
            setError('Please enter a question');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/query`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({
                    question: question,
                    top_k: 3
                })

            });

            if(!response.ok){
                throw new Error('Failed to get answer');
            }
            
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    };
    
    return (
    <section className="flex flex-col items-center">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8 w-full max-w-2xl">
        <div className="chatbox-container">
          {/* Input field */}
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about medical literature..."
            className="chatbox-input"
            disabled={loading}
          />
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="chatbox-btn"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800"> Error: {error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="subtitle">Searching through papers...</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="answer-space">
          {/* Answer Section */}
          <div className="bg-white">
            <h2 className="result-hero">Answer:</h2>
            <p className="result-text">
              {result.answer}
            </p>
          </div>

          {/* Sources Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="result-hero">
              Sources ({result.num_sources}):
            </h2>
            <div className="space-y-3">
              {result.sources.map((source, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        [{source.rank}] {source.file}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Relevance: {source.relevance}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );

}