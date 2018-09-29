<template>
  <div class="blogelement">
    <div class="title">
      <h3>{{blogsubtree.title}}</h3>
    </div>
    <RecursiveBlogListEntry :blogsubtree="sub" v-for="sub in getsubtrees" :key="sub.title"></RecursiveBlogListEntry>
  </div>
</template>

<script>
export default {
  name: 'RecursiveBlogListEntry',
  props: ['blogsubtree'],
  data() {
    return {
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
  margin-left: 5px;
  margin-top: 2px;
  margin-right: 0;
  display: block;
  width: 100%;
  cursor: pointer;
}

.blogelement:hover {
  color: white;
  background-color: #626262;
  padding: 4px;
}

h3 {
  color: lightgray;
  margin: 0;
}
</style>
