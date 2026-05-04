import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import { AppDispatch, RootState } from "../store";
import { fetchComments, clearComments, Post } from "../features/posts/postsSlice";

interface Props {
  post: Post;
  onClose: () => void;
  lang: string;
  darkMode: boolean;
}

export default function PostDetail({ post, onClose, lang, darkMode }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { comments, commentsStatus } = useSelector((s: RootState) => s.posts);

  useEffect(() => {
    const id = post.permalink.split("/")[6] || post.id;
    dispatch(fetchComments({ subreddit: post.subreddit, postId: id }));
    return () => { dispatch(clearComments()); };
  }, [post, dispatch]);

  const bg = darkMode ? "bg-[#1a1d27]" : "bg-white";
  const border = darkMode ? "border-[#343536]" : "border-gray-200";
  const text = darkMode ? "text-[#e8e8e8]" : "text-gray-900";
  const muted = darkMode ? "text-[#818384]" : "text-gray-500";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className={`${bg} w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border ${border}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`sticky top-0 ${bg} border-b ${border} px-5 py-3 flex items-center justify-between`}>
          <span className="text-xs font-mono text-teal">r/{post.subreddit}</span>
          <button onClick={onClose} className={`${muted} hover:text-brand transition-colors text-xl`}>✕</button>
        </div>

        <div className="p-5 space-y-4">
          <h2 className={`font-syne text-lg font-bold leading-snug ${text}`}>{post.title}</h2>
          <p className={`text-xs ${muted}`}>u/{post.author}</p>

          {post.preview?.images?.[0]?.source?.url && (
            <img
              src={post.preview.images[0].source.url.replace(/&amp;/g, "&")}
              alt={post.title}
              className="w-full rounded-xl object-cover max-h-80"
            />
          )}

          {post.selftext && (
            <div className={`text-sm ${muted} prose prose-sm max-w-none`}>
              <ReactMarkdown>{post.selftext}</ReactMarkdown>
            </div>
          )}

          
           <a href={`https://reddit.com${post.permalink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-brand hover:underline">
          
            {lang === "fr" ? "Voir sur Reddit" : "View on Reddit"}
          </a>

          <h3 className={`font-syne font-bold text-sm pt-2 border-t ${border} ${text}`}>
            {lang === "fr" ? "Commentaires" : "Comments"} ({comments.length})
          </h3>

          {commentsStatus === "loading" && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse space-y-1">
                  <div className="w-24 h-3 bg-[#343536] rounded" />
                  <div className="w-full h-3 bg-[#343536] rounded" />
                </div>
              ))}
            </div>
          )}

          {commentsStatus === "succeeded" && comments.length === 0 && (
            <p className={`text-xs ${muted}`}>
              {lang === "fr" ? "Aucun commentaire." : "No comments yet."}
            </p>
          )}

          {commentsStatus === "succeeded" &&
            comments.map((c) => (
              <div key={c.id} className={`border-l-2 ${border} pl-3 space-y-1`}>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-teal font-mono">u/{c.author}</p>
                  <p className={`text-xs ${muted}`}>▲ {c.score}</p>
                </div>
                <div className={`text-sm ${muted} prose prose-sm max-w-none`}>
                  <ReactMarkdown>{c.body}</ReactMarkdown>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}