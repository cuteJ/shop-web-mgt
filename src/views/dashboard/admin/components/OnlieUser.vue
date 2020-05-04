<template>
  <el-table
    :data="list"
    v-loading="listLoading"
    fit
    style="width: 100%;padding-top: 15px; padding-bottom: 30px;"
  >
    <el-table-column label="用户名">
      <template slot-scope="scope">
        {{ scope.row.username }}
      </template>
    </el-table-column>
    <el-table-column
      label="所属商户"
      align="center"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.merchantName }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="IP"
      align="center"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.host }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="过期(分)"
      align="center"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.timeout | timeoutFilter }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="登录时间"
      align="center"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.startTimestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="最近活动"
      align="center"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.lastAccessTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>
    <el-table-column
      :label="$t('table.actions')"
      align="center"
      width="230"
      class-name="small-padding fixed-width"
    >
      <template slot-scope="scope">
        <el-button
          type="danger"
          size="small"
          @click="forceUserLogout(scope.row)"
        >踢出</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { usersOnline, forceLogout } from '@/api/login'

export default {
    filters: {
        timeoutFilter(timeout) {
            return timeout / (1000 * 60)
        }
    },
    data() {
        return {
            list: null,
            listLoading: true
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            usersOnline().then(response => {
                this.list = response
                this.listLoading = false
            })
        },
        forceUserLogout(row) {
            this.$confirm(`确认踢出 ${row.username}`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.listLoading = true
                    forceLogout(row.id).then(response => {
                        this.getList()
                        this.listLoading = false
                    })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    })
                })
        }
    }
}
</script>
