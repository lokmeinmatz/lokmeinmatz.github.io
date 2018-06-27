<template>
  <div id="app">
    <Side/>
    <PlayerBar/>
  </div>
</template>

<script>
import Side from './components/Side'
import PlayerBar from './components/PlayerBar'

export default {
  name: 'App',
  components: {
    Side,
    PlayerBar
  }
}
</script>

<style>
body {
  margin: 0px;
  padding: 0px;
  --side-width: 300px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;

  background: rgb(242,129,35);
  background: linear-gradient(135deg, rgba(242,129,35,1) 0%, rgba(211,78,36,1) 100%);

  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: var(--side-width) auto;
  grid-template-rows: auto 100px;
}
</style>
