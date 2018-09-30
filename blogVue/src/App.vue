<template>
  <div id="app">
    <Header></Header>
    <main>
      <BlogOverview :blogs="blogs"></BlogOverview>
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
import EventBus from './EventBus.js'
import Blog from './BlogClass.js'

Vue.component('RecursiveBlogListEntry', RecursiveBlogListEntry)

export default {
  name: 'app',
  components: {
    Header,
    BlogOverview,
    BlogView
  },
  data() {
    return {
      blogs: [],
      selected: undefined
    }
  },
  methods: {
    getBlogList() {
      fetch('https://lokmeinmatz.github.io/blog/index.json')
      .then(r => r.json())
      .then(j => {
        console.log('Parsing Blog List...')
        this.blogs = []
        //restructure j to "tree"
        for(let blog of j) {
          //Structure: {"title" : cat/title,"URL" : url}
          let path = blog.title.split('/')
          console.log(path)
          let currentLayer = this.blogs
          for(let subPath of path) {
            let elmt = currentLayer.find(e => e.title == subPath)
            let blogPage = subPath == path[path.length - 1]
            if(!elmt) {
              //create object
              let blogObj = new Blog(subPath, blog.title, blogPage ? blog.URL : '', [])
              
              currentLayer.push(blogObj)
              elmt = blogObj
            }
            else if(blogPage) {
              //allready exists, but no url info
              elmt.url = blog.URL
            }
            currentLayer = elmt.children
          }
        }
        console.log('Finished Parsing')
        console.log(this.blogs)
      })
    }
  },
  mounted() {
    this.getBlogList()
    EventBus.$on('selectedBlog', selected => {
      this.selected = selected
    })
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
