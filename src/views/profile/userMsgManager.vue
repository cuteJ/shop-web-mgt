<template>
  <div class="app-container">
  </div>
</template>

<script>
  import waves from '@/directive/waves' // Waves directive
  import {
    sysUserMessageList,
  } from '@/api/login'

  export default {
    name: 'userMsgManager',
    components: {},
    filters: {},
    data() {
      return {
        cacheData: {},
        tableKey: 0,
        list: null,
        total: 0,
        multipleSelection: [],
        listQuery: {
          pageNum: 0,
          pageSize: 10,
          orderBy: ''
        },
      }
    },
    created() {
    },
    mounted() {
      this.handleQueryList()
    },
    methods: {
      /***********************Filter search************************* */
      handleFilter() {
        this.listQuery.pageNum = 0
        this.handleQueryList()
      },
      /***********************Remote query list************************* */
      handleQueryList() {
        this.listLoading = true
        let query = {
          pageSize: this.listQuery.pageSize,
          pageNum: this.listQuery.pageNum,
        };
        sysUserMessageList(query)
          .then(response => {
            this.list = response.list
            this.total = response.total
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            this.listLoading = false
          })
      },
      /***********************Table actions************************* */
      // 打开Form表单
      formOpen(row, isEdit = false) {
        this.isEdit = isEdit
        this.formVisible = true
        if (isEdit) {
          this.formData = Object.assign({}, row)
        } else {
          this.formData = {}
        }
      },
      // 关闭Form表单
      formClose() {
        this.formVisible = false
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
