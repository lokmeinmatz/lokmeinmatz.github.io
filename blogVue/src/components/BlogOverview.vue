<template>
  <div class="blogoverview" :style="{width: width}" @mouseover="expanded = true" @mouseout="expanded = false">
    
  </div>
</template>

<script>
export default {
  name: 'BlogOverview',
  data() {
    return {
      expanded: true
    }
  },
  computed: {
    width() {
      return this.expanded ? '500px' : '200px'
    }
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
