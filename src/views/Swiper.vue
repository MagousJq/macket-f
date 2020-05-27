TabNine:sem
<template>
  <div>
    <Swiper :list="list" />
    <img class="box">
  </div>
</template>
<script>
import Swiper from '../components/swiper'

export default {
  components: { Swiper },
  data () {
    return {
      list: [
        'http://img4.imgtn.bdimg.com/it/u=2983206503,2396638617&fm=26&gp=0.jpg',
        'http://img.zcool.cn/community/01a3575b504954a80121ade0f81779.jpg@1280w_1l_2o_100sh.jpg',
        'http://img4.imgtn.bdimg.com/it/u=1004887276,3848202076&fm=26&gp=0.jpg',
        'http://www.shibeiyinshua.com/images/products/Pudong_Bund_NOWord.jpg',
        'http://img.zcool.cn/community/01e2365982bd34a8012156032f77ee.jpg',
        'http://img2.imgtn.bdimg.com/it/u=1949599039,224278603&fm=26&gp=0.jpg'
      ]
    }
  }
}
</script>

<style scoped lang="less">
.fat {
  width: 200px;
  border: 2px dashed #cd0000;

  .son {
    display: inline-block;
    padding: 50%;
    background-color: gray;
  }
}

.box {
  width:10px;
  height: 10px;
  line-height: 120px; background-color: #f0f3f9;
}
.content { line-height: 20px; margin: 0 20px; vertical-align: middle;
  background: blue;
}
</style>
