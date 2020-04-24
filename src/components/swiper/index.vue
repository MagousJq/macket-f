<template>
  <div
    ref="slider"
    class="slider-container"
    :style="sliderStyle"
    @mouseover="pause()"
    @mouseout="play()"
  >
    <div
      class="slider-content"
      :class="mask ? 'mask' : ''"
    >
      <div
        v-for="(item, index) in list"
        :key="index"
        class="slider"
        :class="setClass(index)"
        :style="setBGImg(item)"
        @click="onClick(index)"
      />
      <i
        v-show="arrow"
        class="iconfont icon-left"
        @click="prev()"
      />
      <i
        v-show="arrow"
        class="iconfont icon-right"
        @click="next()"
      />
    </div>
    <div
      v-if="dots"
      class="dots"
    >
      <span
        v-for="(item, index) in list"
        :key="index"
        :style="setActiveDot(index)"
        @mouseover="currentIndex = index"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      required: true,
      type: Array,
      default () {
        return []
      }
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 320
    },
    imgType: {
      type: String,
      default: 'percentage'
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    mask: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    },
    dots: {
      type: Boolean,
      default: true
    },
    arrow: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: 'rgb(248, 85, 85)'
    }
  },
  data () {
    return {
      currentIndex: 0,
      sliderDomList: [],
      timer: null
    }
  },
  computed: {
    sliderStyle () {
      return {
        width: this.width ? this.width + 'px' : '100%',
        height: this.height ? this.height + 'px' : '100%',
        perspective: this.width + 'px',
        backgroundSize: this.imgType === 'percentage' ? '100% 100%' : this.imgType
      }
    }
  },
  mounted () {
    this.sliderDomList = this.$refs.slider.querySelectorAll('div.slider')
    this.play()
  },
  methods: {
    setClass (i) {
      let next = this.currentIndex === (this.list.length - 1) ? 0 : this.currentIndex + 1
      let prev = this.currentIndex === 0 ? this.list.length - 1 : this.currentIndex - 1
      let className = ''
      switch (i) {
        case this.currentIndex:
          className = 'active'
          break
        case next:
          className = 'next'
          break
        case prev:
          className = 'prev'
          break
        default:
          className = 'hidden'
      }
      return this.isClick ? className + ' fast' : className
    },
    setBGImg (src) {
      return {
        backgroundImage: `url(${src})`
      }
    },
    setActiveDot (index) {
      return index === this.currentIndex ? {
        backgroundColor: this.color
      } : {
        backgroundColor: '#ccc'
      }
    },
    play () {
      this.pause()
      if (this.autoPlay) {
        this.timer = setInterval(() => {
          this.next(false)
        }, this.interval)
      }
    },
    pause () {
      clearInterval(this.timer)
    },
    next (flag) {
      this.isClick = flag
      this.currentIndex = ++this.currentIndex % this.list.length
    },
    prev () {
      this.isClick = true
      this.currentIndex = this.currentIndex === 0 ? this.list.length - 1 : this.currentIndex - 1
    },
    onClick (i) {
      if (i === this.currentIndex) {
        this.$emit('sliderClick', i)
      } else {
        let currentClickClassName = this.sliderDomList[i].className.split(' ')[1]
        if (currentClickClassName === 'next') {
          this.next(true)
        } else {
          this.prev()
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.slider-container{
  overflow: hidden;
  width: 100%;
  max-width: 1400px;
  height: 100%;
  margin: 0 auto;
  text-align: center;
  position: relative;
  .slider-content{
    position: relative;
    width: 100%;
    height: calc(100% - 20px);
    left: 0;
    top: 0;
    margin: 0 auto;
    background-size: inherit;
    .slider{
      position: absolute;
      margin: 0 auto;
      left: 50%;
      top: 0;
      width: 800px;
      height: 100%;
      border-radius: 8px;
      transition: 600ms all ease-in-out;
      background-color: #fff;
      background-repeat: no-repeat;
      background-position: center;
      background-size: inherit;
      transform: translate(-50%,0);
      &:before{
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0);
        transition: 600ms all;
        cursor: pointer;
      }
      &.active{
        transform: translate(-50%, 0);
        z-index: 2;
        background-size: auto 300px;
      }
      &.prev{
        left: 0;
        transform: scale(0.8) translate(-164px, 0);
        z-index: 1;
        background-size: auto 300px;
      }
      &.next{
        left : 100%;
        transform: scale(0.8) translate(-882px, 0);
        z-index: 1;
        background-size: auto 300px;
      }
      &.hidden{
        opacity: 0;
        transition: 600ms ease-out;
      }
    }
    .fast{
      transition: 300ms all ease-in-out;
      &:before{
        transition: 300ms all;
      }
      &.hidden{
        transition: 300ms ease-out;
      }
    }
    i{
      width: 17.5%;
      display: none;
      position: absolute;
      top: 40%;
      font-size: 22px;
      color: rgba(255, 255, 255, 0.5);
      text-shadow: 0 0 24px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      z-index: 2;
      &:first-child{
        left: 0;
      }
      &:last-child{
        right: 0;
      }
    }
    &:hover{
      i{
        color: rgba(255, 255, 255, 0.8);
        display: block;
      }
    }
    &.mask{
      .slider{
        &.prev, &.next{
          &:before{
            border-radius: 8px;
            background-color: rgba(0, 0, 0, 0.50);
          }
        }
      }
    }
  }
  .dots{
    width: 100%;
    height: 20px;
    span{
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin: 1px 6px;
      cursor: pointer;
    }
  }
}
</style>
