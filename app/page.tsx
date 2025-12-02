'use client';

import { useState } from 'react';

interface MarketingAnalysis {
  brandAnalysis: string;
  targetAudience: string;
  competitorInsights: string;
  contentStrategy: string;
  seoRecommendations: string;
  socialMediaStrategy: string;
  paidAdvertising: string;
  emailMarketing: string;
  conversionOptimization: string;
  kpiMetrics: string;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MarketingAnalysis | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze URL');
      }

      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Marketing Expert Team
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Replace your entire marketing team with AI-powered insights
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Just provide a URL and get comprehensive marketing strategy, content, and analytics
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., https://example.com)"
                className="flex-1 px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Our AI marketing team is analyzing the website...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                This may take 30-60 seconds
              </p>
            </div>
          )}

          {/* Results */}
          {analysis && !loading && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Analysis Complete!</h2>
                <p className="text-purple-100">
                  Here's your comprehensive marketing strategy from our AI expert team
                </p>
              </div>

              {/* Brand Analysis */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Brand Analysis
                  </h3>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {analysis.brandAnalysis}
                  </p>
                </div>
              </div>

              {/* Target Audience */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">👥</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Target Audience
                  </h3>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {analysis.targetAudience}
                  </p>
                </div>
              </div>

              {/* Competitor Insights */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Competitor Analysis
                  </h3>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {analysis.competitorInsights}
                  </p>
                </div>
              </div>

              {/* Content Strategy */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Content Strategy
                  </h3>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {analysis.contentStrategy}
                  </p>
                </div>
              </div>

              {/* SEO Recommendations */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    SEO Recommendations
                  </h3>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {analysis.seoRecommendations}
                  </p>
                </div>
              </div>

              {/* Social Media Strategy */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Social Media Strategy
                  </h3>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {analysis.socialMediaStrategy}
                  </p>
                </div>
              </div>

              {/* Paid Advertising */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Paid Advertising Strategy
                  </h3>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {analysis.paidAdvertising}
                  </p>
                </div>
              </div>

              {/* Email Marketing */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">✉️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Email Marketing
                  </h3>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {analysis.emailMarketing}
                  </p>
                </div>
              </div>

              {/* Conversion Optimization */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">📈</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Conversion Optimization
                  </h3>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {analysis.conversionOptimization}
                  </p>
                </div>
              </div>

              {/* KPI Metrics */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    KPI Metrics & Tracking
                  </h3>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {analysis.kpiMetrics}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
