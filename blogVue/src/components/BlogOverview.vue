<template>
  <div class="blogoverview" :style="{width: width}" @mouseover="expanded = true" @mouseout="expanded = false">
    <RecursiveBlogListEntry :blogsubtree="subtree" v-for="subtree in blogs" :key="subtree.title"></RecursiveBlogListEntry>
  </div>
</template>

<script>

import RecursiveBlogListEntry from './RecursiveBlogListEntry.vue'

export default {
  name: 'BlogOverview',
  components: {
    RecursiveBlogListEntry
  },
  data() {
    return {
      expanded: true,
      blogs: []
    }
  },
  computed: {
    width() {
      return this.expanded ? '500px' : '200px'
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
              let lObject = {title: subPath, url: blogPage ? blog.URL : '', children: []}
              currentLayer.push(lObject)
              elmt = lObject
            }
            else if(blogPage) {
              //allready exists, but no url info
              elmt.URL = blog.URL
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.blogoverview {
  transition: width 0.3s ease-in-out;
  margin: 0;
  height: calc(100vh - 60px);
  width: 100px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  align-items: center;
  top: 60px;
  left: 0;
  background-color: #494949;

  grid-column: 1 / span 1;
  grid-row: 1 / span 1;
}

h1 {
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 10px;
  margin-right: 10px;
}

h2 {
  margin-left: 10px;
  padding: 5px;
  border-radius: 4px;
  background-color: #21b2d7;
  color: white;
  font-weight: 300;
}
</style>
