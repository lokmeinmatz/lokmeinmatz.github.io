<template>
  <div id="app">
    <Header></Header>
    <main>
      <BlogOverview></BlogOverview>
      <BlogView></BlogView>
    </main>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import BlogOverview from './components/BlogOverview.vue'
import BlogView from './components/BlogView.vue'
import RecursiveBlogListEntry from './components/RecursiveBlogListEntry.vue'
import Vue from 'vue'
Vue.component('RecursiveBlogListEntry', RecursiveBlogListEntry)

export default {
  name: 'app',
  components: {
    Header,
    BlogOverview,
    BlogView
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0;
}

main {
  display: grid;
  margin-top: 60px;
  grid-template-columns: min-content auto;
}
</style>
