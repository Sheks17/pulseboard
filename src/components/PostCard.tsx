import { Post } from "../features/posts/postsSlice";

interface Props {
  post: Post;
  onClick: (post: Post) => void;
  lang: string;
  darkMode: boolean;
}

function timeAgo(utc: number) {
  const diff = Math.floor((Date.now() / 1000 - utc) / 60);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

function formatScore(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function getImage(post: Post): string | null {
  if (post.preview?.images?.[0]?.source?.url) {
    return post.preview.images[0].source.url.replace(/&amp;/g, "&");
  }
  if (post.thumbnail?.startsWith("http")) return post.thumbnail;
  return null;
}

export default function PostCard({ post, onClick, lang, darkMode }: Props) {
  const image = getImage(post);

  return (
    <article
      onClick={() => onClick(post)}
      className={`flex gap-3 p-4 border rounded-xl cursor-pointer transition-colors group ${
        darkMode
          ? "bg-[#1a1d27] border-[#343536] hover:border-brand"
          : "bg-white border-gray-200 hover:border-brand shadow-sm"
      }`}
    >
      <div className="flex flex-col items-center gap-1 min-w-[40px]">
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-[#818384] hover:text-brand transition-colors text-lg leading-none"
        >▲</button>
        <span className={`text-xs font-mono font-bold ${darkMode ? "text-[#e8e8e8]" : "text-gray-800"}`}>
          {formatScore(post.score)}
        </span>
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-[#818384] hover:text-blue-400 transition-colors text-lg leading-none"
        >▼</button>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-xs font-mono bg-teal/10 text-teal px-2 py-0.5 rounded-full">
            r/{post.subreddit}
          </span>
          <span className={`text-xs ${darkMode ? "text-[#818384]" : "text-gray-500"}`}>
            u/{post.author} · {timeAgo(post.created_utc)}
          </span>
        </div>

        <h2 className={`text-sm font-medium leading-snug line-clamp-2 group-hover:text-brand transition-colors mb-2 ${
          darkMode ? "text-[#e8e8e8]" : "text-gray-900"
        }`}>
          {post.title}
        </h2>

        <div className={`flex items-center gap-3 text-xs ${darkMode ? "text-[#818384]" : "text-gray-500"}`}>
          <span>💬 {formatScore(post.num_comments)} {lang === "fr" ? "commentaires" : "comments"}</span>
          
           <a
            href={`https://reddit.com${post.permalink}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hover:text-brand transition-colors"
          >
            {"🔗 " + (lang === "fr" ? "Ouvrir" : "Open")}
          </a>
        </div>
      </div>

      {image && (
        <img
          src={image}
          alt=""
          className="w-24 h-20 object-cover rounded-lg flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}
    </article>
  );
}