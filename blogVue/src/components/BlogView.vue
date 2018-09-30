<template>
  <div class="blogview">
    <h1 v-if="selected == undefined">No Blog selected</h1>
    <div class="blog" v-else>
      <div class="blog-head">
        <h1>{{selected.title}}</h1>
        <h3></h3>
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
    loadBlog() {
      if(this.selected == undefined) return
      this.selected.loadContent()
    }
  },
  mounted() {
    EventBus.$on('selectedBlog', selected => {
      this.selected = selected
      this.loadBlog()
    })
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
