import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../api/client";
import Spinner from "../Spinner";
import { useAuth } from "../../context/AuthContext";

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Analysis",
  cover_image_url: "",
  status: "draft",
};

function formatDate(value) {
  if (!value) return "Not published";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not published"
    : date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function Blog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === "admin";

  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        isAdmin ? "/admin/articles" : "/articles"
      );
      setArticles(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Unable to load articles:", err);
      setError("We couldn't load articles. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (id) {
      let cancelled = false;

      const loadArticle = async () => {
        setLoading(true);
        setError("");
        setArticle(null);

        try {
          const response = await api.get(
            `/articles/${encodeURIComponent(id)}`
          );
          if (!cancelled) setArticle(response.data);
        } catch (err) {
          if (!cancelled) {
            setError(
              err.response?.status === 404
                ? "This article is unavailable."
                : "Unable to load this article. Please try again."
            );
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      };

      loadArticle();
      return () => {
        cancelled = true;
      };
    }

    loadArticles();
  }, [id, loadArticles]);

  const categories = [
    "All",
    ...new Set(articles.map((item) => item.category).filter(Boolean)),
  ];

  const filteredArticles = articles.filter((item) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      [item.title, item.excerpt, item.category]
        .some((value) => String(value || "").toLowerCase().includes(term));
    const matchesCategory =
      category === "All" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      slug: item.slug || "",
      excerpt: item.excerpt || "",
      content: item.content || "",
      category: item.category || "Analysis",
      cover_image_url: item.coverImageUrl || "",
      status: item.status || "draft",
    });
    document.getElementById("article-editor")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        article: {
          ...form,
          slug: form.slug.trim() || undefined,
        },
      };

      if (editingId) {
        await api.patch(`/articles/${editingId}`, payload);
      } else {
        await api.post("/articles", payload);
      }

      await Swal.fire({
        icon: "success",
        title: editingId ? "Article updated" : "Article created",
        text:
          form.status === "published"
            ? "The article is published."
            : "The article has been saved as a draft.",
        background: "#111111",
        color: "#ffffff",
        confirmButtonColor: "#facc15",
      });

      resetForm();
      await loadArticles();
    } catch (err) {
      const detail = err.response?.data?.error;
      const message = Array.isArray(detail)
        ? detail.join("\n")
        : detail || "Please check the fields and try again.";

      await Swal.fire({
        icon: "error",
        title: "Could not save article",
        text: message,
        background: "#111111",
        color: "#ffffff",
      });
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (item) => {
    const publishing = item.status !== "published";

    const confirmation = await Swal.fire({
      title: publishing ? "Publish this article?" : "Unpublish this article?",
      text: publishing
        ? "It will become visible to the public."
        : "It will be removed from the public article listing.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: publishing ? "Publish" : "Unpublish",
      confirmButtonColor: "#eab308",
      background: "#111111",
      color: "#ffffff",
    });

    if (!confirmation.isConfirmed) return;

    try {
      await api.patch(`/articles/${item.id}`, {
        article: { status: publishing ? "published" : "draft" },
      });
      await loadArticles();
      await Swal.fire({
        icon: "success",
        title: publishing ? "Article published" : "Article unpublished",
        background: "#111111",
        color: "#ffffff",
      });
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Action failed",
        text: err.response?.data?.error?.toString() || "Please try again.",
        background: "#111111",
        color: "#ffffff",
      });
    }
  };

  const deleteArticle = async (item) => {
    const confirmation = await Swal.fire({
      title: "Delete this article?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete article",
      confirmButtonColor: "#dc2626",
      background: "#111111",
      color: "#ffffff",
    });

    if (!confirmation.isConfirmed) return;

    try {
      await api.delete(`/articles/${item.id}`);
      if (editingId === item.id) resetForm();
      await loadArticles();
      await Swal.fire({
        icon: "success",
        title: "Article deleted",
        background: "#111111",
        color: "#ffffff",
      });
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: err.response?.data?.error?.toString() || "Please try again.",
        background: "#111111",
        color: "#ffffff",
      });
    }
  };

  if (id) {
    return (
      <main className="min-h-screen px-4 pb-16 pt-24 text-white sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/news"
            className="inline-flex min-h-[44px] items-center text-sm font-bold text-yellow-400 hover:text-yellow-300"
          >
            ← Back to Analysis
          </Link>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <Spinner />
            </div>
          ) : error ? (
            <div className="pt-card mt-6 p-8 text-center">
              <p className="text-gray-300">{error}</p>
              <button
                onClick={() => navigate("/news")}
                className="mt-5 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black"
              >
                Browse articles
              </button>
            </div>
          ) : article ? (
            <article className="pt-card mt-6 overflow-hidden">
              {article.coverImageUrl && (
                <img
                  src={article.coverImageUrl}
                  alt=""
                  className="max-h-[420px] w-full object-cover"
                />
              )}
              <div className="p-5 sm:p-10">
                <span className="text-xs font-black uppercase tracking-widest text-yellow-400">
                  {article.category}
                </span>
                <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
                  {article.title}
                </h1>
                <p className="mt-4 text-sm text-gray-400">
                  Published {formatDate(article.publishedAt)}
                  {article.author ? ` · By ${article.author}` : ""}
                </p>
                {article.excerpt && (
                  <p className="mt-7 border-l-2 border-yellow-400 pl-4 text-lg leading-8 text-gray-300">
                    {article.excerpt}
                  </p>
                )}
                <div className="mt-8 whitespace-pre-wrap break-words text-base leading-8 text-gray-200">
                  {article.content}
                </div>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      await Swal.fire({
                        icon: "success",
                        title: "Link copied",
                        background: "#111111",
                        color: "#ffffff",
                      });
                    } catch {
                      await Swal.fire({
                        icon: "info",
                        title: "Share this article",
                        text: window.location.href,
                        background: "#111111",
                        color: "#ffffff",
                      });
                    }
                  }}
                  className="mt-8 min-h-[44px] rounded-xl border border-yellow-400/30 px-5 py-3 font-bold text-yellow-400 hover:bg-yellow-400/10"
                >
                  Share article
                </button>
              </div>
            </article>
          ) : null}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 pb-16 pt-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
            POWER TIPS PREDICTIONS
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">
            Football Analysis
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-gray-400">
            Read match previews, tactical insights and football analysis
            published by the PowerTips team.
          </p>
        </header>

        {isAdmin && (
          <section id="article-editor" className="pt-card mb-8 p-5 sm:p-7">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-yellow-400">
                  Article Publisher
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Create drafts or publish articles for public reading.
                </p>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="min-h-[40px] rounded-lg border border-white/1x-4 text-sm font-bold"
                >
                  New article
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-gray-300">
                Title *
                <input
                  required
                  maxLength={255}
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="mt-2 min-h-[44px] w-full rounded-xl border border-white/10 bg-black/50 px-3 text-white outline-none focus:border-yellow-400"
                />
              </label>

              <label className="text-sm text-gray-300">
                URL slug (optional)
                <input
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value })
                  }
                  placeholder="generated-from-title"
                  className="mt-2 min-h-[44px] w-full rounded-xl border border-white/10 bg-black/50 px-3 text-white outline-none focus:border-yellow-400"
                />
              </label>

              <label className="text-sm text-gray-300">
                Category *
                <input
                  required
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="mt-2 min-h-[44px] w-full rounded-xl border border-white/10 bg-black/50 px-3 text-white outline-none focus:border-yellow-400"
                />
              </label>

              <label className="text-sm text-gray-300">
                Cover image URL
                <input
                  type="url"
                  value={form.cover_image_url}
                  onChange={(e) =>
                    setForm({ ...form, cover_image_url: e.target.value })
                  }
                  placeholder="https://..."
                  className="mt-2 min-h-[44px] w-full rounded-xl border border-white/10 bg-black/50 px-3 text-white outline-none focus:border-yellow-400"
                />
              </label>

              <label className="text-sm text-gray-300 sm:col-span-2">
                Short summary *
                <textarea
                  required
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm({ ...form, excerpt: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 p-3 text-white outline-none focus:border-yellow-400"
                />
              </label>

              <label className="text-sm text-gray-300 sm:col-span-2">
                Article content *
                <textarea
                  required
                  rows={8}
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 p-3 leading-7 text-white outline-none focus:border-yellow-400"
                />
              </label>

              <label className="text-sm text-gray-300">
                Publication status
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className="mt-2 min-h-[44px] w-full rounded-xl border border-white/10 bg-black px-3 text-white outline-none focus:border-yellow-400"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="min-h-[46px] w-full rounded-xl bg-yellow-400 px-5 py-3 font-black text-black transition hover:bg-yellow-300 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Create article"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="mb-7 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title, summary or category..."
            className="min-h-[48px] rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none placeholder:text-gray-500 focus:border-yellow-400"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-h-[48px] rounded-xl border border-white/10 bg-black px-4 text-white outline-none focus:border-yellow-400"
          >
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </section>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="pt-card p-8 text-center">
            <p className="text-gray-300">{error}</p>
            <button
              onClick={loadArticles}
              className="mt-4 rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black"
            >
              Try again
            </button>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="pt-card p-10 text-center">
            <h2 className="text-xl font-black">
              {articles.length ? "No matching articles" : "No articles published yet"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              {articles.length
                ? "Try another search term or category."
                : isAdmin
                  ? "Use the publisher above to create your first article."
                  : "Check back later for football analysis from PowerTips."}
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((item) => (
              <article
                key={item.id}
                className="pt-card flex min-w-0 flex-col overflow-hidden transition hover:border-yellow-400/30"
              >
                {item.coverImageUrl && (
                  <img
                    src={item.coverImageUrl}
                    alt=""
                    loading="lazy"
                    className="h-44 w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-yellow-400">
                      {item.category}
                    </span>
                    {isAdmin && (
                      <span className={`text-xs font-bold ${
                        item.status === "published"
                          ? "text-emerald-400"
                          : "text-gray-400"
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-3 break-words text-xl font-black leading-snug">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-xs text-gray-500">
                    {formatDate(item.publishedAt)}
                  </p>
                  <p className="mt-4 flex-1 whitespace-pre-line break-words text-sm leading-6 text-gray-400">
                    {item.excerpt}
                  </p>

                  {item.status === "published" && (
                    <Link
                      to={`/news/${encodeURIComponent(item.slug || item.id)}`}
                      className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
                    >
                      Read analysis →
                    </Link>
                  )}

                  {isAdmin && (
                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                      <button
                        onClick={() => startEditing(item)}
                        className="min-h-[42px] rounded-lg border border-white/15 px-3 text-sm font-bold hover:bg-white/5"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => togglePublish(item)}
                        className="min-h-[42px] rounded-lg border border-yellow-400/30 px-3 text-sm font-bold text-yellow-400 hover:bg-yellow-400/10"
                      >
                        {item.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => deleteArticle(item)}
                        className="col-span-2 min-h-[42px] rounded-lg border border-red-500/30 px-3 text-sm font-bold text-red-400 hover:bg-red-500/10"
                    >
                        Delete article
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Blog;
