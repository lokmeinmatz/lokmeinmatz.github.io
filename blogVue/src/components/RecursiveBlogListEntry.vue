<template>
  <div class="blogelement">
    <div class="title">
      <h3 @click="selectedBlog()">{{blogsubtree.title}}</h3>
    </div>
    <RecursiveBlogListEntry :blogsubtree="sub" v-for="sub in getsubtrees" :key="sub.title"></RecursiveBlogListEntry>
  </div>
</template>

<script>
import EventBus from '../EventBus.js'


export default {
  name: 'RecursiveBlogListEntry',
  props: ['blogsubtree'],
  data() {
    return {
    }
  },
  methods: {
    selectedBlog() {
      EventBus.$emit('selectedBlog', this.blogsubtree)
    }
  },
  computed: {
    getsubtrees() {
      return this.blogsubtree.children
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.blogelement {
  margin-left: 10px;
  margin-top: 2px;
  margin-right: 0;
  display: block;
  width: 100%;
  cursor: pointer;

}

.blogelement h3:hover {
  color: white;
  background-color: #626262;

}

h3 {
  text-align: left;
  padding: 4px;
  padding-left: 20px;
  transition: all 0.2s ease;
  color: lightgray;
  margin: 0;
  border-radius: 4px;
  white-space: nowrap;
}
</style>
