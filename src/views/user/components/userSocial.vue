<template>
    <div>
        <div class="filter-container">
            <el-input
                placeholder="OpenId"
                v-model="listQuery.openId"
                style="width: 250px;"
                @keyup.enter.native="handleFilter"
            >
            </el-input>

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
                <!-- <el-col :span="20">
                    <el-button
                        class="action-item"
                        size="small"
                        v-waves
                        icon="el-icon-plus"
                        @click="formOpen"
                    >{{ $t('table.add') }}</el-button>
                    <el-button
                        class="action-item"
                        size="small"
                        v-waves
                        icon="el-icon-edit"
                        @click="handleSelected('edit')"
                    >{{ $t('table.edit') }}</el-button>
                </el-col> -->
                <el-col
                    :span="4"
                    :offset="20"
                >
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
            @row-click="handleRowClick"
        >
            <el-table-column
                type="selection"
                width="55"
            >
            </el-table-column>
            <el-table-column
                label="OpenId"
                align="center"
                width="300px"
            >
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="handleClipboard(scope.row.openId, $event)"
                    >
                        {{ scope.row.openId }}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                label="是否绑定"
                align="center"
                width="100px"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.uid ? '已绑定':'未绑定' }}</span>
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
                    <!-- <el-tooltip
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
                    </el-tooltip> -->
                </template>
            </el-table-column>
        </el-table>

        <el-row class="wx-user-detail">
            <el-form
                ref="formData"
                label-width="100px"
                inline
                class="wx-form"
            >
                <el-form-item label="头像">
                    <img
                        :src="formData.headImgUrl"
                        class="user-avatar"
                    >
                </el-form-item>
                <el-form-item label="UnionId">
                    <span>{{formData.unionId}}</span>
                </el-form-item>
                <el-form-item label="OpenId">
                    <span>{{formData.openId}}</span>
                </el-form-item>
                <el-form-item label="昵称">
                    <span>{{formData.nickName}}</span>
                </el-form-item>
                <el-form-item label="关注">
                    <span>{{formData.subscribe ? '是':'否'}}</span>
                </el-form-item>
                <el-form-item label="性别">
                    <span>{{formData.sexDesc}}</span>
                </el-form-item>
                <el-form-item label="国家">
                    <span>{{formData.country}}</span>
                </el-form-item>
                <el-form-item label="省">
                    <span>{{formData.province}}</span>
                </el-form-item>
                <el-form-item label="城市">
                    <span>{{formData.city}}</span>
                </el-form-item>
                <el-form-item label="关注时间">
                    <span>{{formData.subscribeTime}}</span>
                </el-form-item>
                <el-form-item label="关注渠道">
                    <span>{{formData.subscribeScene}}</span>
                </el-form-item>
                <el-form-item label="备注">
                    <span>{{formData.remark}}</span>
                </el-form-item>
            </el-form>
        </el-row>
    </div>
</template>

<script>
import { userSocial, wxUserDetail } from '@/api/user'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import SysCode from '@/components/SysCode'
import DyFilterInput from '@/components/DyFilterInput'
import FormDialog from '@/components/FormDialog'
import { cacheData } from '@/utils/cache'
import clipboard from '@/utils/clipboard'

export default {
    name: 'userSocial',
    components: {
        SysCode,
        FormDialog,
        DyFilterInput
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
            listQuery: {},
            formData: {
                id: '',
                createdTime: '',
                lastModifiedTime: '',
                remark: '',
                subscribe: null,
                nickName: '',
                openId: '',
                unionId: '',
                sex: null,
                sexDesc: '',
                language: '',
                city: '',
                province: '',
                country: '',
                headImgUrl: '',
                privileges: '',
                groupId: null,
                subscribeTime: '',
                unsubscribeTime: '',
                subscribeScene: ''
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
        handleClipboard(text, event) {
            clipboard(text, event)
        },
        /***********************Remote query list************************* */
        handleQueryList() {
            this.listLoading = true
            let query = {
                uid: this.listQuery.uid,
                channel: this.listQuery.channel,
                platform: this.listQuery.platform
            }
            userSocial(query)
                .then(response => {
                    this.list = response
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
        },
        handleRowClick(row, event, column) {
            wxUserDetail(row.openId).then(data => {
                this.formData = data
            })
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
.wx-user-detail {
    margin-top: 30px;
}
</style>
<style>
.wx-form {
    font-size: 0;
}
.wx-form label {
    width: 90px;
    color: #99a9bf;
}
.wx-form.el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>

