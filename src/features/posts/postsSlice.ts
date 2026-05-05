import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Post {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  score: number;
  num_comments: number;
  created_utc: number;
  thumbnail: string;
  selftext: string;
  permalink: string;
  url: string;
  preview?: { images: { source: { url: string } }[] };
}

export interface Comment {
  id: string;
  author: string;
  body: string;
  score: number;
}

interface PostsState {
  posts: Post[];
  comments: Comment[];
  status: "idle" | "loading" | "succeeded" | "failed";
  commentsStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  activeSubreddit: string;
  searchQuery: string;
  sort: string;
}

const initialState: PostsState = {
  posts: [],
  comments: [],
  status: "idle",
  commentsStatus: "idle",
  error: null,
  activeSubreddit: "programming",
  searchQuery: "",
  sort: "hot",
};

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (subreddit: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { posts: PostsState };
      const sort = state.posts.sort;
      const res = await fetch(
        `h/api/reddit/r/${subreddit}/${sort}.json?limit=25`,
        { headers: { Accept: "application/json" } }
      );
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      return data.data.children.map((c: any) => c.data) as Post[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const searchPosts = createAsyncThunk(
  "posts/searchPosts",
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `/api/reddit/search.json?q=${encodeURIComponent(query)}&limit=25`,
        { headers: { Accept: "application/json" } }
      );
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      return data.data.children.map((c: any) => c.data) as Post[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async ({ subreddit, postId }: { subreddit: string; postId: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `/api/reddit/r/${subreddit}/comments/${postId}.json`,
        { headers: { Accept: "application/json" } }
      );
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = await res.json();
      return data[1].data.children
        .filter((c: any) => c.kind === "t1")
        .map((c: any) => c.data) as Comment[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setActiveSubreddit(state, action) {
      state.activeSubreddit = action.payload;
      state.searchQuery = "";
      state.posts = [];
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setSortOrder(state, action) {
      state.sort = action.payload;
      state.posts = [];
    },
    clearComments(state) {
      state.comments = [];
      state.commentsStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(fetchPosts.fulfilled, (state, action) => { state.status = "succeeded"; state.posts = action.payload; })
      .addCase(fetchPosts.rejected, (state, action) => { state.status = "failed"; state.error = action.payload as string; })
      .addCase(searchPosts.pending, (state) => { state.status = "loading"; state.error = null; })
      .addCase(searchPosts.fulfilled, (state, action) => { state.status = "succeeded"; state.posts = action.payload; })
      .addCase(searchPosts.rejected, (state, action) => { state.status = "failed"; state.error = action.payload as string; })
      .addCase(fetchComments.pending, (state) => { state.commentsStatus = "loading"; })
      .addCase(fetchComments.fulfilled, (state, action) => { state.commentsStatus = "succeeded"; state.comments = action.payload; })
      .addCase(fetchComments.rejected, (state) => { state.commentsStatus = "failed"; });
  },
});

export const { setActiveSubreddit, setSearchQuery, setSortOrder, clearComments } = postsSlice.actions;
export default postsSlice.reducer;