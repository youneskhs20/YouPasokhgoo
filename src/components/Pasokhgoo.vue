<template>
  <router-view></router-view>
</template>

<script>
export default {
  methods: {
    handleQuerySearch() {
      console.log("searching...");
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;500&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Vazirmatn", sans-serif;
}
</style>
