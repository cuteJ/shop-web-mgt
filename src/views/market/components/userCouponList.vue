<template>
    <div>
        <el-dialog
            :center="true"
            :title="title"
            :top="top"
            :width="width"
            :visible.sync="formVisible"
            :fullscreen='fullscreen'
            @close="handleCancel"
        >
            <slot></slot>
            <div class="filter-container">
                <el-input
                    placeholder="手机号"
                    v-model="listQuery.username"
                    style="width: 250px;"
                    @keyup.enter.native="handleFilter"
                >
                </el-input>
                <el-date-picker
                    v-model="regRange"
                    type="daterange"
                    start-placeholder="注册开始日期"
                    end-placeholder="注册结束日期"
                >
                </el-date-picker>
            </div>
            <el-row class="select-show">
                <span> 选中的用户</span>
                <el-tag
                    :key="item.username"
                    v-for="item in multipleSelection"
                    :disable-transitions="false"
                >
                    {{item.username}}
                </el-tag>
            </el-row>
            <div class="actions-container">
                <el-row>
                    <el-col :span="24">
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
                @selection-change="handleSelectionChange"
            >
                <el-table-column
                    type="selection"
                    width="55"
                >
                </el-table-column>
                <el-table-column
                    label="头像"
                    align="center"
                >
                    <template slot-scope="scope">
                        <img
                            :src="scope.row.headImgUrl"
                            class="user-avatar"
                        >
                    </template>
                </el-table-column>
                <el-table-column
                    label="昵称"
                    align="center"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.nickName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="手机号"
                    align="center"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.username }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="可用优惠券数量"
                    align="center"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.couponNum }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="可用优惠券"
                    align="center"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.couponNames }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createdTime"
                    sortable
                    label="注册时间"
                    width="200px"
                    align="center"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.createdTime | parseTime }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div
                slot="footer"
                class="dialog-footer"
            >
                <div>
                    <el-button
                        waves
                        type="primary"
                        @click="handleSubmit"
                    >{{ $t('table.confirm') }}</el-button>
                    <el-button @click="handleCancel">{{ $t('table.cancel') }}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import { userCouponList } from '@/api/user'
import { parseTime } from '@/utils'

const defaultRegRange = [
    parseTime(new Date(), '{y}-{m}-{d}'),
    parseTime(
        new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        '{y}-{m}-{d}'
    )
]
export default {
    name: 'UserCouponList',
    props: {
        inputStyle: {
            type: String,
            default: 'width: 100%;'
        },
        visible: {
            type: Boolean,
            default: false
        },
        multi: {
            type: Boolean,
            default: true
        },
        width: {
            type: String,
            default: '50%'
        },
        top: {
            type: String,
            default: '15vh'
        },
        title: {
            type: String
        }
    },
    directives: { waves },
    data() {
        return {
            tableKey: 0,
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {},
            regRange: defaultRegRange,
            multipleSelection: [],
            fullscreen: false
        }
    },
    computed: {
        formVisible: {
            get() {
                return this.visible
            },
            set(val) {
                this.$emit('update:visible', val)
            }
        }
    },
    mounted() {
        this.handleFilter()
    },
    methods: {
        /***********************Filter search************************* */
        handleFilter() {
            this.handleQueryList()
        },
        handleReset() {
            this.regRange = defaultRegRange
            this.handleQueryList()
        },
        /***********************Remote query list************************* */
        handleQueryList() {
            this.listLoading = true
            if (!this.regRange || this.regRange.length < 2) {
                this.regRange = ['', '']
            }
            let query = {
                username: this.listQuery.username,
                startAt: this.regRange[0],
                endAt: this.regRange[1]
            }
            userCouponList(query)
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
        handleCancel(event) {
            this.$emit('onCancel', event)
        },
        handleSubmit(event) {
            let multipleSelection = this.multipleSelection
            if (!this.multi) {
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
                this.$emit('onSubmit', multipleSelection[0], event)
            } else {
                if (
                    !multipleSelection.length ||
                    multipleSelection.length == 0
                ) {
                    this.$message({
                        type: 'warning',
                        message: '请至少选择一条数据进行操作'
                    })
                    return
                }
                this.$emit('onSubmit', multipleSelection, event)
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.user-avatar {
    // vertical-align: 10px;
    width: 40px;
    height: 40px;
}
.select-show {
    el-tag {
        margin-left: 10px;
    }
}
</style>
