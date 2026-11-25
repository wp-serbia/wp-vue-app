export default {
  methods: {
    async get(path) {
      const { cache, endpoint } = this.$store.state;
      if (cache.requests[path]) return cache.requests[path];

      const response = await fetch(endpoint + path);
      if (!response.ok) throw new Error("WordPress returned HTTP " + response.status);
      const data = {
        data: await response.json(),
        headers: {
          "x-wp-total": response.headers.get("x-wp-total"),
          "x-wp-totalpages": response.headers.get("x-wp-totalpages")
        }
      };

      if (this.$store.state.endpoint !== endpoint) return data;
      this.$store.commit("cache/saveRequest", { path, data });

      if (path.startsWith("/posts?per_page=")) {
        for (const post of data.data) {
          this.$store.commit("cache/saveRequest", {
            path: "/posts?slug=" + encodeURIComponent(post.slug),
            data: { data: [post] }
          });
        }
      }

      return data;
    }
  }
};
