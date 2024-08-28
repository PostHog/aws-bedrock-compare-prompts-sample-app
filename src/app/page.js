'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [promptId, setPromptId] = useState('');
  const [prompt, setPrompt] = useState('');
  const [email, setEmail] = useState('');
  const [output, setOutput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    setOutput('');
    setFeedbackGiven(false);
    try {
      const response = await fetch('/api/generate-llm-output', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId, prompt, email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recipe');
      }
      setOutput(data.generation);
    } catch (error) {
      setError(error.message || 'An error occurred while generating the recipe');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedback = (isHelpful) => {
    setFeedbackGiven(true);
  };

  return (
    <div className="mx-auto p-4 flex items-start flex-col space-y-4">
      <h1 className="text-2xl mb-4">Prompt Builder</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="border p-2 mr-2 text-black"
      />
      <input
        type="text"
        value={promptId}
        onChange={(e) => setPromptId(e.target.value)}
        placeholder="Prompt ID"
        className="border p-2 mr-2 text-black"
      />
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        className="border p-2 mr-2 text-black"
      />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`${
          isSubmitting ? 'bg-gray-500' : 'bg-blue-500'
        } text-white px-4 py-2 rounded mr-2`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {output && (
        <>
          <p className="my-4 whitespace-pre">{output}</p>
          {!feedbackGiven && (
            <div className="mt-4">
              <p className="mb-2">Was this response helpful?</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleFeedback(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleFeedback(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  No
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

