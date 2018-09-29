<template>
  <header>
    <h1>lokmeinmatz.github.io</h1>
    <h2>Blog</h2>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
header {
  margin: 0;
  height: 60px;
  width: 100vw;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #72d3eb;
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
