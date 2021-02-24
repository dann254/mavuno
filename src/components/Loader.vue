<template>
    <div class="loader p-2">
        <div v-bind:style="styles" class="spinner spinner--circle-2"></div>

    </div>
</template>
<script>
export default {
  props: {
    size: {
      default: '30px'
    },
    background: {
      default: '#2C7BE5'
    },
    color: {
      default: '#E3EBF6'
    },
    stroke: {
      default: '3px'
    }
  },
  computed: {
    styles () {
      return {
        width: this.size,
        height: this.size,
        border: this.stroke + ' solid ' + this.background,
        borderTopColor: this.color
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .loader {
      display: flex;
      justify-content: center;
  }
  .spinner {
    box-sizing: border-box;
    border-radius: 100%;
    border: 10px solid rgba(255, 255, 255, 0.2);
    animation: circle-2-spin 1s infinite linear;
  }
  @keyframes circle-2-spin {
    100% {
      transform: rotate(360deg);
    }
  }
</style>