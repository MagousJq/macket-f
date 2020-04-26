<template>
  <div>
    <Swiper :list="list" />
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
