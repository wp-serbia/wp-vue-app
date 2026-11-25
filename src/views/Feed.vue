<template>
  <div>

    <section>
      <p>
        WordPress Vue JS is a simple template built with Vue JS that displays posts from a WordPress REST API.
      </p>
      <p>
        <strong>TO DO:</strong> Menu Support, Widget Support.
      </p>
    </section>

    <ul>
      <Card
        v-for="post in posts"
        :post="post"
        :key="post.id"
      />
    </ul>

    <Pagination
      :currentPage="parseInt(page)"
      :totalPages="parseInt(totalPages)"
    ></Pagination>

  </div>
</template>

<script>
import bus from '../bus';
import ajax from '../mixins/ajax';
import Card from '../components/Card.vue';
import Pagination from '../components/Pagination.vue';

export default {
  name: 'Feed',

  mixins: [ajax],

  data () {
    return {
      posts: [],
      page: 1,
      totalPages: null
    }
  },

  mounted: function () {
    this.getPosts();
  },

  created: function () {
    if(this.$route.name === 'page') {
      this.page = this.$route.params.page;
    }
  },

  methods: {
    getPosts: async function () {
      let response;

      try {
        response = await this.get(
          `/posts?per_page=${POSTS_PER_PAGE}&page=${this.page}`
        );
        this.totalPages = response.headers['x-wp-totalpages'];
      } catch {
        bus.emit('showUpdater', 'Are you sure that\'s a valid endpoint?');
        bus.emit('toggleLoading', false);
        return;
      }

      this.posts = await this.getFeaturedImages(response.data);

      this.getAdjacentPageData();

      bus.emit('toggleLoading', false);
    },

    async getAdjacentPageData() {
      const page = Number(this.page);
      for (const adjacent of [page + 1, page - 1]) {
        if (adjacent < 1 || adjacent > this.totalPages) continue;
        try {
          const response = await this.get(
            `/posts?per_page=${POSTS_PER_PAGE}&page=${adjacent}`
          );
          await this.getFeaturedImages(response.data);
        } catch {
          // Prefetching is optional. A visit to the page will retry.
        }
      }
    },

    getFeaturedImages(posts) {
      return Promise.all(posts.map(async post => {
        let image = null;
        if (post.featured_media > 0) {
          try {
            const media = await this.get(`/media/${post.featured_media}`);
            image = media.data.media_details?.sizes?.medium?.source_url;
          } catch {
            // A post can still be displayed when its image is unavailable.
          }
        }
        return { ...post, featured_image: image };
      }));
    }
  },

  components: {
    Card,
    Pagination
  }
}

</script>

<style scoped lang="scss">

  section {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 3rem;
  }

  ul {
    display: grid;
    grid-template-columns: repeat( auto-fit, minmax( 320px, auto ) );
    grid-gap: 1rem;
  }
</style>

