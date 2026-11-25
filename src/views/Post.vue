<template>
  <div>
    <article>
      <a @click="goBack">Back to All Posts</a>

      <header>
        <img v-if="featured_image" :src="featured_image" />
        <h1 v-html="title"></h1>

        <ul>
          <li>
            <span>Published on {{ date }}</span>
          </li>
          <li>
            <span>
              <a :href="link">View Post at Source</a>
            </span>
          </li>
        </ul>
      </header>

      <PostBody :content="content"></PostBody>
    </article>
  </div>
</template>

<script>
import bus from "../bus";
import utils from "../mixins/utils";
import ajax from "../mixins/ajax";
import PostBody from "../components/PostBody.vue";

export default {
  name: "Post",

  mixins: [utils, ajax],

  data() {
    return {
      post: {},
      date: "",
      link: "",
      title: "",
      content: "",
      featured_image: ""
    };
  },

  created: async function() {
    try {
      const response = await this.get(`/posts?slug=${encodeURIComponent(this.$route.params.slug)}`);
      this.post = response.data[0];
      if (!this.post) throw new Error("Post not found");
    } catch {
      this.$router.replace({ name: "four-o-four" });
      return;
    }
    this.link = this.post.link;
    this.date = this.getFormattedDate(this.post.date);
    this.title = this.post.title.rendered;
    this.content = this.post.content.rendered;
    this.featured_image = await this.getFeaturedImage(this.post.featured_media);

    bus.emit("toggleLoading", false);
  },

  methods: {
    async getFeaturedImage(id) {
      if (!id) return null;
      try {
        const response = await this.get(`/media/${id}`);
        return response.data.media_details?.sizes?.medium?.source_url;
      } catch {
        return null;
      }
    }
  },

  components: {
    PostBody
  }
};
</script>

<style scoped lang="scss">
@use "../assets/scss/mixins" as *;
@use "../assets/scss/variables" as *;
article {
  max-width: 900px;
  margin: 0 auto;
  background: #cccccc;
  border: 2px solid #bfbfbf;
  padding: 1rem;

  @include media($small) {
    padding: 3rem;
  }
}

header {
  margin-bottom: 1rem;
}

h1 {
  margin: 2rem 0 0;
}

ul {
  @include media($mobile) {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 5px;
  }
}

li {
  & + & {
    &:before {
      @include media($mobile) {
        content: "|";
        float: left;
        margin: 0 5px 0 0;
      }
    }
  }

  a {
    color: inherit;
    font-weight: 600;

    &:hover {
      color: $action-color;
    }
  }
}

a {
  display: block;
  margin-bottom: 1rem;
}
</style>
