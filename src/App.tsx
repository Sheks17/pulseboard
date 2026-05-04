import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { AppDispatch, RootState } from "./store";
import { fetchPosts, Post } from "./features/posts/postsSlice";
import Navbar from "./components/Navbar";
import PostCard from "./components/PostCard";
import SkeletonCard from "./components/SkeletonCard";
import ErrorState from "./components/ErrorState";
import PostDetail from "./components/PostDetail";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, status, error, activeSubreddit, sort } = useSelector(
    (s: RootState) => s.posts
  );

  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState("en");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    dispatch(fetchPosts(activeSubreddit));
  }, [activeSubreddit, sort, dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.body.style.backgroundColor = darkMode ? "#0f1117" : "#f6f7f8";
    document.body.style.color = darkMode ? "#e8e8e8" : "#1c1c1c";
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#0f1117]" : "bg-[#f6f7f8]"}`}>
      <Navbar
        darkMode={darkMode}
        toggleDark={() => setDarkMode((d) => !d)}
        lang={lang}
        toggleLang={() => setLang((l) => (l === "en" ? "fr" : "en"))}
        activeSub={activeSubreddit}
        sort={sort}
      />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {status === "loading" &&
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

        {status === "failed" && (
          <ErrorState
            onRetry={() => dispatch(fetchPosts(activeSubreddit))}
            lang={lang}
          />
        )}

        {status === "succeeded" && (
          <AnimatePresence>
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <PostCard
                  post={post}
                  onClick={setSelectedPost}
                  lang={lang}
                  darkMode={darkMode}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </main>

      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PostDetail
              post={selectedPost}
              onClose={() => setSelectedPost(null)}
              lang={lang}
              darkMode={darkMode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}