<template>
  <div class="contain">
    <Table
      :loading="loading"
      :height="tableHeight"
      stripe
      draggable
      border
      :columns="columns"
      :data="buffData"
    >
      <div
        slot="header"
        class="contain__table-header"
      >
        <Button
          class="contain__store"
          type="primary"
          :disabled="isRequesting"
          @click="handleStore"
        >
          导一把
        </Button>
        <span
          v-show="time"
          class="contain__time"
        >
          {{ '导入时间：' + time }}
        </span>
        <Button
          class="contain__buy"
          type="primary"
          @click="handleOpenQuery"
        >
          高级筛选
        </Button>
        <Button
          class="contain__buy"
          type="primary"
          @click="() => handleCanBuy({})"
        >
          查询可买
        </Button>
        <Button
          class="contain__sell"
          type="primary"
          @click="handleCanSell"
        >
          查询可卖
        </Button>
      </div>
    </Table>
    <search-modal
      :is-modal-show="isModalShow"
      @handleCancle="handleCancle"
      @handleSearch="handleSearch"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ClipboardJS from 'clipboard'
import searchModal from '@/components/searchModal.vue'
import Util from '@/utils'
export default {
  components: {
    searchModal
  },
  data () {
    return {
      loading: false,
      isRequesting: false,
      isModalShow: false,
      columns: [{
        title: '序号',
        key: 'id',
        width: 75,
        align: 'center',
        render: (h, obj) => {
          return (<div>
            {obj.index + 1}
          </div>)
        }
      }, {
        title: '物品名称',
        key: 'goodsName',
        align: 'center',
        render: (h, obj) => {
          let href = `https://buff.163.com/market/goods?goods_id=${obj.row.buffId}&from=market#tab=selling`
          return (<div>
            <a href={href} target="_blank">
              <input id={'copy' + obj.row.buffId} style={{ position: 'fixed', top: '-2000px' }} value={obj.row.goodsName} />
              <span style={{ cursor: 'pointer', color: '#36cfc9' }} class="btn-clip" data-clipboard-target={'#copy' + obj.row.buffId}>{obj.row.goodsName}</span>
            </a>
          </div>)
        }
      },
      {
        title: 'buff售价',
        key: 'buffMinPrice',
        align: 'center',
        render: (h, obj) => {
          let hrefSteam = obj.row.steamMarketUrl
          return (
            <div className="opt-div">
              <a href={hrefSteam} target="_blank">{obj.row.buffMinPrice}</a>
            </div>)
        },
        sortable: true
      },
      {
        title: 'steam售价',
        key: 'steamMinPrice',
        align: 'center',
        sortable: true
      },
      {
        title: 'igxe售价',
        key: 'igxeMinPrice',
        align: 'center',
        sortable: true
      },
      {
        title: '当前在售量',
        key: 'sellNum',
        align: 'center',
        sortable: true
      },
      {
        title: '操作',
        key: 'id',
        width: 180,
        align: 'center',
        render: (h, obj) => {
          let hrefIgxe = `https://www.igxe.cn/csgo/730?keyword=${obj.row.goodsName}`
          let href = `https://buff.163.com/market/goods?goods_id=${obj.row.buffId}&from=market#tab=selling`
          let hrefSteam = obj.row.steamMarketUrl
          return (
            <div className="opt-div">
              <a href={hrefIgxe} target="_blank">去igxe </a>
              <a href={href} target="_blank">去buff </a>
              <a href={hrefSteam} target="_blank">去steam</a>
            </div>)
        }
      }],
      buffData: [],
      allTime: 0,
      count: 0,
      percent: 0,
      tableHeight: 300
    }
  },
  computed: {
    time: function () {
      return this.buffData[0] ? Util.formatDate(this.buffData[0].time) : ''
    }
  },
  created () {
    // 配置提示框
    this.$Message.config({
      duration: 3
    })
    this.$Notice.config({
      top: 20,
      duration: 0
    })
  },
  mounted () {
    // 复制事件
    let clipboard = new ClipboardJS('.btn-clip')
    clipboard.on('success', function (e) {
      e.clearSelection()
    })
    clipboard.on('error', function () {})
    this.setTableHeight()
  },
  destroyed () {
    this.$Notice.destroy()
  },
  methods: {
    ...mapActions([
      'CsgoCanBuy',
      'CsgoCanSell',
      'CsgoStore'
    ]),
    /**
     * 设置表格高度 js控制自适应
     */
    setTableHeight () {
      let windowHeight = window.innerHeight ? window.innerHeight : document.body.clientWidth
      let height = windowHeight - 84 - 20
      this.tableHeight = parseInt(height) < 300 ? 300 : height
    },
    handleStore () {
      this.isRequesting = true
      this.CsgoStore().then(data => {
        let min = parseInt(data.time / 60) + 1
        this.allTime = parseInt(data.time + 60)
        this.count = 0
        this.percent = 0
        this.$Notice.open({
          title: '通知',
          render: () => (<div style={{ lineHeight: '25px' }}>
            <p>{'导入已开始进行，预计' + min + '分钟'}</p>
            <p style={{ fontWeight: 'bold' }}>建议：导入触发频率请勿过快！！！</p>
            <Progress percent={parseFloat(this.percent)} />
          </div>)
        })
        let interval = setInterval(() => {
          if (parseInt(this.count) >= parseInt(this.allTime)) {
            this.isRequesting = false
            window.clearInterval(interval)
          } else {
            this.count++
            this.percent = parseFloat(this.count / this.allTime * 100).toFixed(2)
          }
        }, 1000)
      }).catch(err => {
        this.$Message.error(err.message || '导入失败')
      })
    },
    handleOpenQuery () {
      this.isModalShow = true
    },
    handleCanBuy (form) {
      this.loading = true
      this.CsgoCanBuy(form).then(data => {
        this.loading = false
        this.buffData = data
      }).catch(err => {
        this.loading = false
        this.$Message.error(err.message || '数据加载失败')
      })
    },
    handleCanSell () {
      this.loading = true
      this.CsgoCanSell().then(data => {
        this.loading = false
        this.buffData = data
      }).catch(err => {
        this.loading = false
        this.$Message.error(err.message || '数据加载失败')
      })
    },
    handleCancle () {
      this.isModalShow = false
    },
    handleSearch (form) {
      this.isModalShow = false
      this.handleCanBuy(form)
    }
  }
}
</script>

<style scoped lang="less">
.contain{
  &__table-header{
    text-align: right;
  }
  &__store{
    float: left;
    margin-top: 8px;
    margin-left: 10px;
  }
  &__time{
    vertical-align: -2px;
    font-size: 14px;
    margin-right: 10px;
  }
  &__buy{
    margin-right: 10px;
  }
  &__sell{
    margin-right: 20px;
  }
  .go-buff{
    margin-right: 4px;
  }
}
</style>
