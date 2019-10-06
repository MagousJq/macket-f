<template>
  <div class="contain">
    <Table
      :loading="loading"
      stripe
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
        title: '物品名称(点击名字复制)',
        key: 'goodsName',
        align: 'center',
        render: (h, obj) => {
          return (<div>
            <input id={'copy' + obj.row.buffId} style={{ position: 'fixed', top: '-2000px' }} value={obj.row.goodsName} />
            <span style={{ cursor: 'pointer', color: '#36cfc9' }} class="btn-clip" data-clipboard-target={'#copy' + obj.row.buffId}>{obj.row.goodsName}</span>
          </div>)
        }
      },
      {
        title: 'buff最低售价',
        key: 'buffMinPrice',
        align: 'center',
        sortable: true
      },
      {
        title: 'steam最低售价',
        key: 'steamMinPrice',
        align: 'center',
        sortable: true
      },
      {
        title: '当前在售数量',
        key: 'sellNum',
        align: 'center',
        sortable: true
      },
      {
        title: '导入时间',
        key: 'time',
        align: 'center',
        render: (h, obj) => { return (<span>{Util.formatDate(obj.row.time)}</span>) }
      },
      {
        title: '操作',
        key: 'id',
        width: 130,
        align: 'center',
        render: (h, obj) => {
          let href = `https://buff.163.com/market/goods?goods_id=${obj.row.buffId}&from=market#tab=selling`
          return (
            <div className="opt-div">
              <a href={href} target="_blank">去buff</a>
            </div>)
        }
        // <Button size="small" type="success" onClick={() => this.goSteam(obj.row)}>去steam</Button>
      }],
      buffData: [],
      allTime: 0,
      count: 0,
      percent: 0
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
    goBuff (obj) {
      const url = `https://buff.163.com/market/goods?goods_id=${obj.buffId}&from=market#tab=selling`
      window.open(url, '_blank')
    },
    goSteam (obj) {
      const url = `https://buff.163.com/market/goods?goods_id=${obj.buffId}&from=market#tab=selling`
      window.open(url, '_blank')
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
