<template>
    <div>
        <h3>
            <svg-icon icon-class="menu" /> 微信客服</h3>
        <div class="filter-container">
            <el-input
                placeholder="微信客服账号"
                v-model="listQuery.kfAccount"
                style="width: 250px;"
                @keyup.enter.native="handleFilter"
            >
            </el-input>
        </div>
        <div class="actions-container">
            <el-row>
                <el-col :span="20">
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
                    <el-button
                        class="action-item"
                        size="small"
                        v-waves
                        icon="el-icon-edit"
                        @click="handleRefreshWxData"
                    >同步微信客服</el-button>
                </el-col>
                <el-col :span="4">
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
                label="客服账号"
                align="center"
                width="200px"
            >
                <template slot-scope="scope">
                    <span>{{scope.row.kfAccount}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="客服昵称"
                align="center"
                width="150px"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.kfNick }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="客服头像"
                align="center"
                width="120px"
            >
                <template slot-scope="scope">
                    <img
                        class="user-avatar"
                        :src="scope.row.kfHeadImgUrl"
                    >
                </template>
            </el-table-column>
            <el-table-column
                label="已绑定微信"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.kfWx }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="微信绑定状态"
                align="center"
                width="250px"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.kfWx">已绑定</span>
                    <div v-else-if="!scope.row.kfWx && (scope.row.inviteStatus == 'rejected' || scope.row.inviteStatus == 'expired')">
                        <el-button
                            class="action-item"
                            type="text"
                            v-waves
                            @click="formOpenType(scope.row, 'invite')"
                        >重新绑定 </el-button>
                        <span> {{scope.row.inviteWx}}({{ scope.row.inviteStatus | inviteStatusFilter}})</span>
                    </div>
                    <el-button
                        v-else
                        class="action-item"
                        type="text"
                        v-waves
                        @click="formOpenType(scope.row, 'invite')"
                    >点击绑定</el-button>
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
                        content="上传头像"
                        placement="top-start"
                    >
                        <el-button
                            class="action-item"
                            type="text"
                            v-waves
                            icon="el-icon-upload"
                            @click="formOpenType(scope.row, 'upload')"
                        ></el-button>
                    </el-tooltip>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('table.edit')"
                        placement="top-start"
                    >
                        <el-button
                            class="action-item"
                            type="text"
                            v-waves
                            icon="el-icon-edit"
                            @click="formOpen(scope.row, true)"
                        ></el-button>
                    </el-tooltip>

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
        <form-dialog
            :visible.sync='formVisible'
            :title="isEdit? $t('table.edit'):$t('table.add')"
            @onCancel="formClose"
            @onSubmit="handleFormSave"
        >
            <el-form
                ref="formData"
                :rules="rules"
                :model="formData"
                label-width="120px"
            >
                <el-form-item
                    label="客服账号"
                    prop="kfAccount"
                >
                    <el-input
                        placeholder="账号前缀@公众号微信号"
                        v-model="formData.kfAccount"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="客服昵称"
                    prop="kfNick"
                >
                    <el-input
                        v-model="formData.kfNick"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                        type="textarea"
                        v-model="formData.remark"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
        </form-dialog>

        <h3>
            <svg-icon icon-class="menu" /> 商家客服</h3>
        <div class="filter-container">
        </div>
        <div class="actions-container">
            <el-row>
                <el-col :span="20">
                    <el-button
                        class="action-item"
                        size="small"
                        v-waves
                        icon="el-icon-plus"
                        @click="formOpenMerchant"
                    >{{ $t('table.add') }}</el-button>
                    <el-button
                        class="action-item"
                        size="small"
                        v-waves
                        icon="el-icon-edit"
                        @click="handleSelectedMerchant('edit')"
                    >{{ $t('table.edit') }}</el-button>
                </el-col>
                <el-col :span="4">
                    <div class="right-actions">
                        <el-button
                            class="action-item"
                            size="small"
                            icon="el-icon-circle-close-outline"
                            @click="handleResetMerchant"
                        >{{ $t('table.reset') }}</el-button>
                        <el-button
                            class="action-item"
                            size="small"
                            icon="el-icon-search"
                            @click="handleFilterMerchant"
                        >{{ $t('table.query') }}</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-table
            v-loading="listLoadingMerchant"
            :key="1"
            :data="listMerchant"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            :default-sort="{prop: 'createdDate', order: 'descending'}"
            @selection-change="handleSelectionChangeMerchant"
        >
            <el-table-column
                type="selection"
                width="55"
            >
            </el-table-column>
            <el-table-column
                label="微信客服"
                align="center"
                width="200px"
            >
                <template slot-scope="scope">
                    <span>{{scope.row.kfAccount}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="商家编号"
                align="center"
                width="150px"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.merchantNo }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="客服类型"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.kfType | statusFilter(cacheData.statusMap['1017']) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="OpenId"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.openId }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="客服处理优先级"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.byOrder }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="客服电话"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.kfTel }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="问候语"
                align="center"
                :show-overflow-tooltip='true'
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.greetings }}</span>
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
                        :content="$t('table.edit')"
                        placement="top-start"
                    >
                        <el-button
                            class="action-item"
                            type="text"
                            v-waves
                            icon="el-icon-edit"
                            @click="formOpenMerchant(scope.row, true)"
                        ></el-button>
                    </el-tooltip>

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
                            @click="handleRemoveMerchant(scope.row.id)"
                        ></el-button>
                    </el-tooltip>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="绑定微信(接收新订单通知)"
                        placement="top-start"
                        v-if="!scope.row.openId"
                    >
                        <el-button
                            class="action-item"
                            type="text"
                            @click="bindWechat(scope.row)"
                        >绑定微信</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="totalMerchant>0"
            :total="totalMerchant"
            :page.sync="listQueryMerchant.pageNum"
            :limit.sync="listQueryMerchant.pageSize"
            @pagination="handleQueryListMerchant"
        />
        <form-dialog
            :visible.sync='formVisibleMerchant'
            :title="isEditMerchant ? $t('table.edit'):$t('table.add')"
            @onCancel="formCloseMerchant"
            @onSubmit="handleFormSaveMerchant"
        >
            <el-form
                ref="formDataMerchant"
                :rules="rulesMerchant"
                :model="formDataMerchant"
                label-width="120px"
            >
                <el-form-item
                    label="商户编号"
                    prop="merchantNo"
                >
                    <el-input
                        :disabled="true"
                        v-model="formDataMerchant.merchantNo"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="客服类型"
                    prop="kfType"
                >
                    <sys-code
                        v-if="cacheData.codes"
                        :cacheOptions="cacheData['codes']"
                        :typeCode="'1017'"
                        :selected.sync="formDataMerchant.kfType"
                    ></sys-code>
                </el-form-item>
                <el-form-item
                    label="微信客服"
                    prop="merchantNo"
                >
                    <dy-select
                        ref="dySelect"
                        :placeholder="'请选择微信客服'"
                        :selected.sync="formDataMerchant.kfId"
                        :selectType="'WX_KEFU'"
                    >
                    </dy-select>
                </el-form-item>
                <el-form-item
                    label="客服电话"
                    prop="kfTel"
                >
                    <el-input
                        v-model="formDataMerchant.kfTel"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="客服处理优先级"
                    prop="byOrder"
                >
                    <el-input
                        v-model="formDataMerchant.byOrder"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="问候语"
                    prop="greetings"
                >
                    <el-input
                        v-model="formDataMerchant.greetings"
                        type="textarea"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                        v-model="formDataMerchant.remark"
                        type="textarea"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
        </form-dialog>

        <form-dialog
            :visible.sync='formVisibleType'
            :title="actionType == 'upload' ? '上传头像' : '邀请绑定'"
            @onCancel="formCloseType"
            @onSubmit="handleFormSaveType"
        >
            <el-form
                ref="formData"
                label-width="120px"
            >
                <el-form-item
                    v-if="actionType == 'upload'"
                    label="头像"
                >
                    <upload-head-image
                        @input="updateImgUrl"
                        :value="formData.kfHeadImgUrl || ''"
                        :businessNo="kfId"
                    ></upload-head-image>
                </el-form-item>
                <el-form-item
                    v-else
                    label="客服微信"
                >
                    <el-input
                        placeholder="请填写需要绑定的微信号"
                        v-model="inviteWx"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
        </form-dialog>
        <el-dialog
            :center="true"
            title="微信授权"
            :visible.sync="wxFormVisible"
            @close="handleCancel"
        >
            <div>
                <el-image
                    style="width: 400px; height: 400px; margin:0 auto;display:block;"
                    :src="wxQrImg"
                >
                </el-image>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    kefuList,
    kefuSave,
    kefuRemove,
    inviteWorker,
    refreshWxKefu,
    merchantKefuList,
    merchantKefuSave,
    merchantKefuRemove,
    getKfMerchantRel,
    wxLogin
} from '@/api/merchant'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import SysCode from '@/components/SysCode'
import DySelect from '@/components/DySelect'
import FormDialog from '@/components/FormDialog'
import { cacheData } from '@/utils/cache'
import UploadHeadImage from './uploadHeadImage'

export default {
    name: 'merchantKefu',
    components: {
        Pagination,
        SysCode,
        FormDialog,
        DySelect,
        UploadHeadImage
    },
    directives: { waves },
    filters: {
        inviteStatusFilter: function(value) {
            if ('waiting' === value) {
                return '等待确定'
            } else if ('rejected' === value) {
                return '用户拒绝'
            } else if ('expired' === value) {
                return '请求已过期'
            } else {
                return '未绑定'
            }
        }
    },
    data() {
        return {
            cacheData: {},
            merchantNo: '',
            tableKey: 0,
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                pageNum: 0,
                pageSize: 10,
                orderBy: '+id',
                kfAccount: ''
            },
            multipleSelection: [],
            multipleSelectionMerchant: [],
            formVisible: false,
            formVisibleType: false,
            wxFormVisible: false,
            wxQrImg: '',
            timer: null,
            actionType: '',
            isEdit: false,
            formData: {
                id: null,
                merchantNo: '',
                remark: '',
                inviteStatus: '',
                inviteWx: '',
                kfAccount: '',
                kfHeadImgUrl: '',
                kfNick: '',
                kfWx: ''
            },
            kfId: '',
            inviteWx: '',
            rules: {
                kfAccount: [
                    {
                        required: true,
                        message: '客户账号必填',
                        trigger: 'blur'
                    }
                ]
            },
            formVisibleMerchant: false,
            isEditMerchant: false,
            listMerchant: null,
            totalMerchant: 0,
            listLoadingMerchant: true,
            listQueryMerchant: {
                pageNum: 0,
                pageSize: 10
            },
            formDataMerchant: {
                id: null,
                remark: '',
                greetings: '',
                kfId: '',
                kfAccount: '',
                kfType: '',
                merchantNo: '',
                byOrder: 0,
                kfTel: '',
                openId: ''
            },
            rulesMerchant: {
                merchantNo: [
                    {
                        required: true,
                        message: '商户编号',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    created() {},
    mounted() {
        cacheData(this.cacheData, '1000,1017').then(() => {
            this.handleQueryList()
            this.handleQueryListMerchant()
        })
        this.formDataMerchant.merchantNo = this.$route.params.merchantNo
        this.merchantNo = this.$route.params.merchantNo
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
        handleFilterMerchant() {
            this.listQueryMerchant.pageNum = 1
            this.handleQueryListMerchant()
        },
        /***********************Remote query list************************* */
        handleQueryList() {
            this.listLoading = true
            let query = {
                pageSize: this.listQuery.pageSize,
                pageNum: this.listQuery.pageNum,
                'params[kfAccount]': this.listQuery.kfAccount
            }
            kefuList(query)
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
                this.formData.merchantNo = this.merchantNo
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
            }).then(() => {
                kefuRemove(id).then(() => {
                    this.handleFilter()
                })
            })
        },
        handleRefreshWxData() {
            this.$confirm(`确认同步微信数据？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                refreshWxKefu(this.merchantNo).then(data => {
                    this.handleFilter()
                })
            })
        },
        handleInviteWorker() {
            inviteWorker(this.kfId, { value: this.inviteWx })
                .then(data => {
                    this.handleFilter()
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {})
        },
        // 表单提交处理
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    kefuSave(this.formData)
                        .then(data => {
                            this.handleFilter()
                            this.$refs.dySelect.$emit('updateData')
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        .finally(() => {
                            this.formVisible = false
                        })
                }
            })
        },
        handleReset() {
            this.listQuery.pageNum = 0
            this.listQuery.kfAccount = ''
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

        formOpenType(row, actionType) {
            this.formVisibleType = true
            this.actionType = actionType
            this.kfId = row.id
            if ('upload' == actionType) {
            } else {
            }
        },
        // 关闭Form表单
        formCloseType() {
            this.formVisibleType = false
            this.inviteWx = ''
            this.kfId = ''
        },
        handleFormSaveType() {
            if ('upload' == this.actionType) {
                this.handleFilter()
            } else if ('invite' == this.actionType) {
                if (!this.inviteWx) {
                    this.$message({
                        type: 'error',
                        message: '请填写需要邀请的微信号'
                    })
                    return
                }
                inviteWorker(this.kfId, { value: this.inviteWx }).then(data => {
                    this.formCloseType()
                    this.handleFilter()
                })
            }
        },
        updateImgUrl(value) {
            this.formCloseType()
            this.handleFilter()
        },
        //==================商户客服============================
        handleQueryListMerchant() {
            this.listLoadingMerchant = true
            let query = {
                pageSize: this.listQueryMerchant.pageSize,
                pageNum: this.listQueryMerchant.pageNum,
                'params[merchantNo]': this.merchantNo
            }
            merchantKefuList(query)
                .then(response => {
                    this.listMerchant = response.list
                    this.totalMerchant = response.total
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    this.listLoadingMerchant = false
                })
        },
        // 打开Form表单
        formOpenMerchant(row, isEdit = false) {
            this.isEditMerchant = isEdit
            this.formVisibleMerchant = true
            if (isEdit) {
                this.formDataMerchant = Object.assign({}, row)
            } else {
                this.formDataMerchant = {}
                this.formDataMerchant.merchantNo = this.$route.params.merchantNo
            }
        },
        // 关闭Form表单
        formCloseMerchant() {
            this.formVisibleMerchant = false
            this.$refs['formDataMerchant'].resetFields()
        },
        handleRemoveMerchant(id) {
            this.$confirm(`确认删除这条记录？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                merchantKefuRemove(id).then(() => {
                    this.handleQueryListMerchant()
                })
            })
        },
        // 表单提交处理
        handleFormSaveMerchant() {
            this.$refs['formDataMerchant'].validate(valid => {
                if (valid) {
                    merchantKefuSave(this.formDataMerchant)
                        .then(data => {
                            this.handleQueryListMerchant()
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        .finally(() => {
                            this.formVisibleMerchant = false
                        })
                }
            })
        },
        handleResetMerchant() {
            this.listQueryMerchant.pageNum = 1
            this.handleQueryListMerchant()
        },
        handleSelectionChangeMerchant(val) {
            this.multipleSelectionMerchant = val
        },
        //处理单项选择
        handleSelectedMerchant(type) {
            let multipleSelection = this.multipleSelectionMerchant
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
                this.formOpenMerchant(multipleSelection[0], true)
            }
        },
        // 处理多项选择
        handleMultiSelectedMerchant(type) {
            let multipleSelection = this.multipleSelectionMerchant
            if (!multipleSelection.length || multipleSelection.length == 0) {
                this.$message({
                    type: 'warning',
                    message: '请至少选择一条数据进行操作'
                })
                return
            }
        },
        bindWechat(row) {
            wxLogin(`kf,${row.id}`)
                .then(data => {
                    this.wxFormVisible = true
                    this.wxQrImg = `http://qr.topscan.com/api.php?&w=400&text=${encodeURIComponent(
                        data.value
                    )}`
                    // 轮询结果
                    this.timer = setInterval(() => {
                        getKfMerchantRel(row.id).then(data => {
                            if (data.openId) {
                                this.$notify({
                                    title: '成功',
                                    message: '授权成功',
                                    type: 'success',
                                    duration: 2000
                                })
                                this.wxFormVisible = false
                                this.handleQueryListMerchant()
                            }
                        })
                    }, 3000)
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {})
        },
        handleCancel() {
            this.wxFormVisible = false
            clearInterval(this.timer)
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
