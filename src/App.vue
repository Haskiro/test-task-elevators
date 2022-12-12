<template>
  <div class="app">
    <ul class="list" ref="mainBlock">
      <li
        class="item"
        :style="{ height: calcFloorHeight() + 'px' }"
        v-for="n in floorCount"
        :key="n"
      >
        <div
          class="col"
          :style="{
            width:
              calcElevatorWidth() > 100
                ? 150 + 'px'
                : calcElevatorWidth() + 'px',
          }"
          v-for="n in elevatorCount"
          :key="n"
        ></div>
      </li>
    </ul>
  </div>
</template>

<script>
import "../styles/reset.scss";

export default {
  name: "App",
  components: {},
  data() {
    return {
      floorCount: 5,
      elevatorCount: 1,
      windowHeight: null,
      windowWidth: null,
    };
  },
  mounted() {
    this.matchHeightAndWidth();
  },
  methods: {
    matchHeightAndWidth: function () {
      this.windowHeight = this.$refs.mainBlock.clientHeight;
      this.windowWidth = this.$refs.mainBlock.clientWidth;
    },
    calcFloorHeight: function () {
      return Math.floor(this.windowHeight / this.floorCount);
    },
    calcElevatorWidth: function () {
      return Math.floor(this.windowWidth / this.elevatorCount);
    },
  },
  computed: {},
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.list {
  height: 100vh;
}

.item {
  border: 1px solid lightgrey;
  display: flex;
}

.col {
  border-right: 2px solid black;
  border-left: 2px solid black;
  height: 100%;
  box-sizing: content-box;
}
</style>
