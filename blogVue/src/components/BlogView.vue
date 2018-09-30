<template>
  <div class="blogview">
    <h1 v-if="selected == undefined">No Blog selected</h1>
    <h2 v-else-if="selected.content == undefined">Blog loading...</h2>
    <div class="blog" v-else>
      <div class="blog-content" v-html="selected.content">
      </div>
    </div>
  </div>
</template>

<script>

import EventBus from '../EventBus.js'



export default {
  name: 'BlogView',
  data() {
    return {
      selected: undefined
    }
  },
  methods: {
    loadBlog(selected) {
      this.selected = selected
      if(this.selected == undefined) return
      this.selected.loadContent()
    }
  },
  mounted() {
    EventBus.$on('selectedBlog', this.loadBlog)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.blogview {
  grid-column: 2 / span 1;
  grid-row: 1 / span 1;
  position: relative;
  -webkit-box-shadow: 5px 0px 10px 10px rgba(0,0,0,0.75);
  -moz-box-shadow: 5px 0px 10px 10px rgba(0,0,0,0.75);
  box-shadow: 5px 0px 10px 10px rgba(0,0,0,0.75);
}

.blog {
  width: 100%;
}

.blog-content {
  max-width: 1000px;
  margin: 0 auto;
  text-align: left;
  font-size: 1.2rem;
}

.blog-content h1 {
  text-align: center;
}
.blog-content h2 {
  text-align: center;
}
.blog-content h3 {
  text-align: center;
}

</style>
