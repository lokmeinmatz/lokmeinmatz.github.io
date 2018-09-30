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
<style scoped>
.blogview {
  grid-column: 2 / span 1;
  grid-row: 1 / span 1;
}

</style>
