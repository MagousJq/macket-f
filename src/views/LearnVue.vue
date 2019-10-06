<template>
  <div class="content">
    <div
      class="scroll"
      @scroll.passive="onScroll"
    >
      <div style="height: 600px;">
        xx
      </div>
    </div>
    <div>
      <input
        v-model.trim="value"
        type="text"
      >
      <p>{{ value }}</p>
      <p>{{ value.length }}</p>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: ''
    }
  },
  methods: {
    onScroll () {

    }
  }
}
</script>
<style scoped lang="less">
.content{
  padding: 50px;
}
.scroll{
  height: 300px;
  overflow: auto;
}
</style>
