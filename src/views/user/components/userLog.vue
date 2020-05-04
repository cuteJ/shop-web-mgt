<template>
    <div>
        <div class="filter-container">
            <sys-code
                v-if="cacheData.codes"
                style="width: 250px;"
                :cache-options="cacheData['codes']"
                :type-code="'1005'"
                :selected.sync="listQuery.channel"
            />
            <sys-code
                v-if="cacheData.codes"
                style="width: 250px;"
                :cache-options="cacheData['codes']"
                :type-code="'1006'"
                :selected.sync="listQuery.platform"
            />

        </div>
        <div class="actions-container">
            <el-row>
                <el-col :span="4" :offset="20">
                    <div class="right-actions">
                        <el-button
                            class="action-item"
                            size="small"
                            icon="el-icon-circle-close-outline"
                            @click="handleReset"
                        >{{ $t('table.reset') }}</el-button>
                        <el-button
                            class="action-item"
                            size="small"
                            icon="el-icon-search"
                            @click="handleFilter"
                        >{{ $t('table.query') }}</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

        <el-table
            v-loading="listLoading"
            :key="tableKey"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            :default-sort="{prop: 'createdDate', order: 'descending'}"
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                type="selection"
                width="55"
            >
            </el-table-column>
            <el-table-column
                label="用户名"
                align="center"
                width="150px"
            >
                <template slot-scope="scope">
                    <span>{{scope.row.username}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="登录IP"
                align="center"
                width="150px"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.loginIp }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="IP位置"
                align="center"
                width="120px"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.ipGeo }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="渠道"
                align="center"
                width="100px"
            >
                <template slot-scope="scope">
                    <span v-if="cacheData.statusMap">{{ scope.row.channel | statusFilter(cacheData.statusMap['1005'])}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="平台"
                align="center"
                width="100px"
            >
                <template slot-scope="scope">
                    <span v-if="cacheData.statusMap">{{ scope.row.platform | statusFilter(cacheData.statusMap['1006'])}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="备注"
                align="center"
                :show-overflow-tooltip='true'
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.remark }}</span>
                </template>
            </el-table-column>

            <el-table-column
                prop="createdTime"
                sortable
                :label="$t('table.createdTime')"
                width="200px"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.createdTime | parseTime }}</span>
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('table.actions')"
                align="center"
                width="150"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('table.delete')"
                        placement="top-start"
                    >
                        <el-button
                            class="action-item"
                            type="text"
                            v-waves
                            icon="el-icon-delete"
                            @click="handleRemove(scope.row.id)"
                        ></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.pageNum"
            :limit.sync="listQuery.pageSize"
            @pagination="handleQueryList"
        />
    </div>
</template>

<script>
import { userLoginLog } from '@/api/user'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import SysCode from '@/components/SysCode'
import DyFilterInput from '@/components/DyFilterInput'
import FormDialog from '@/components/FormDialog'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { cacheData } from '@/utils/cache'

export default {
    name: 'userSocial',
    components: {
        SysCode,
        FormDialog,
        DyFilterInput,
        Pagination
    },
    directives: { waves },
    filters: {},
    data() {
        return {
            cacheData: {},
            uid: '',
            tableKey: 0,
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                pageNum: 0,
                pageSize: 10,
                orderBy: '+id'
            },
            multipleSelection: [],
            rules: {}
        }
    },
    created() {},
    mounted() {
        cacheData(this.cacheData, '1005,1006').then(() => {
            this.handleQueryList()
        })
        this.listQuery.uid = this.$route.params.uid
        this.uid = this.$route.params.uid
    },
    methods: {
        cellStyle() {
            return 'padding: 5px 0px;'
        },
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
                'params[uid]': this.listQuery.uid,
                'params[channel]': this.listQuery.channel,
                'params[platform]': this.listQuery.platform
            }
            userLoginLog(query)
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
            this.$refs['formData'].resetFields()
        },
        handleRemove(id) {
            this.$confirm(`确认删除这条记录？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {})
        },
        // 表单提交处理
        handleFormSave() {},
        handleReset() {
            this.listQuery.pageNum = 0
            this.listQuery.channel = ''
            this.listQuery.platform = ''
            this.handleQueryList()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        //处理单项选择
        handleSelected(type) {
            let multipleSelection = this.multipleSelection
            if (
                !multipleSelection.length ||
                multipleSelection.length == 0 ||
                multipleSelection.length > 1
            ) {
                this.$message({
                    type: 'warning',
                    message: '请选择一条数据进行操作'
                })
                return
            }
            if ('edit' === type) {
                this.formOpen(multipleSelection[0], true)
            }
        },
        // 处理多项选择
        handleMultiSelected(type) {
            let multipleSelection = this.multipleSelection
            if (!multipleSelection.length || multipleSelection.length == 0) {
                this.$message({
                    type: 'warning',
                    message: '请至少选择一条数据进行操作'
                })
                return
            }
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.tab-container {
    position: relative;
    padding: 40px 30px;
}
.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
}
</style>
