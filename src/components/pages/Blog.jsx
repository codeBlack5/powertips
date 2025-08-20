// src/components/pages/Blog.jsx
import React, { useState, useEffect } from "react";
import Spinner from "../Spinner";

function Blog() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fake loading simulation
    setTimeout(() => {
      setBlogs([
        {
          title: "How to Analyze Betting Odds Like a Pro",
          date: "2025-08-15",
          excerpt: "Learn the fundamentals of odds, probability, and how bookmakers set their lines.",
        },
        {
          title: "Top 5 Football Strategies That Win",
          date: "2025-08-10",
          excerpt: "We break down five tactical approaches that consistently bring results.",
        },
        {
          title: "Understanding Variance in Sports Betting",
          date: "2025-08-05",
          excerpt: "Variance is what makes betting unpredictable—here’s how to manage it.",
        },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="pt-24 pb-12 px-4 min-h-screen text-white">
      {/* Page Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
        Sports News
      </h1>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        /* Blog Grid */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, i) => (
            <div
              key={i}
              className="bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition transform"
            >
              <h2 className="text-xl font-bold mb-2 text-blue-400">
                {blog.title}
              </h2>
              <p className="text-gray-400 text-sm mb-4">{blog.date}</p>
              <p className="text-gray-300 mb-4">{blog.excerpt}</p>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition text-white font-medium">
                Read More →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Blog;
