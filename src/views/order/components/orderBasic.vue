<template>
    <div class="tab-container">
        <el-row class="action-header">
            <el-button
                v-if="formData.statusId == 'SUBMIT_ONLINE'"
                type="success"
                @click="formOpen('paid')"
            >线下支付
            </el-button>
            <el-button
                v-if="formData.statusId == 'PAID'"
                type="success"
                @click="formOpen('confirm')"
            >核对确认
            </el-button>
            <el-button
                v-if="formData.statusId == 'CONFIRMED'"
                type="success"
                @click="formOpen('delivery')"
            >发货确认
            </el-button>
            <el-button
                v-if="formData.statusId == 'DELIVERING'"
                type="success"
                @click="formOpen('receipt')"
            >签收确认
            </el-button>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="12">
                <div class="base-header">
                    <h3>
                        <svg-icon icon-class="order" /> 基本信息</h3>
                </div>
                <el-form
                    ref="formData"
                    label-position="left"
                    label-width="120px"
                    class="basic-table"
                >
                    <el-form-item
                        label="订单编号"
                        prop="orderNo"
                    >
                        <el-button
                            type="text"
                            @click="handleClipboard(formData.orderNo, $event)"
                        >{{formData.orderNo}}</el-button>
                    </el-form-item>
                    <el-form-item
                        label="下单时间"
                        prop="createdTime"
                    >
                        <span>{{ formData.createdTime | parseTime }}</span>
                    </el-form-item>
                    <el-form-item
                        label="内部状态"
                        prop="statusId"
                    >
                        <span v-if="cacheData.options">{{ formData.statusId | statusFilter(cacheData.options['ORDER_STATUS'])}}</span>
                    </el-form-item>
                    <el-form-item
                        label="外部状态"
                        prop="statusId"
                    >
                        <span v-if="cacheData.options">{{ formData.status | statusFilter(cacheData.options['ORDER_STATUS'])}}</span>
                    </el-form-item>
                    <el-form-item label="备注">
                        <span>{{ formData.remark }}</span>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="12">
                <div class="base-header">
                    <h3>
                        <svg-icon icon-class="order_dev" /> 配送信息</h3>
                </div>
                <el-form
                    label-position="left"
                    label-width="120px"
                    class="basic-table"
                >
                    <el-form-item
                        label="配送方式"
                        prop="deliveryMethod"
                    >
                        <span v-if="cacheData.statusMap">{{ formData.deliveryMethod | statusFilter(cacheData.statusMap['1010'])}}</span>
                    </el-form-item>
                    <el-form-item
                        label="收货人手机号"
                        prop="phoneNo"
                    >
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="点击拨打电话"
                            placement="top-start"
                        >
                            <el-link
                                :underline="false"
                                :href="'tel:'+formData.phoneNo"
                            >{{ formData.phoneNo }}
                            </el-link>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item
                        label="收货人地址"
                        prop="fullAddress"
                    >
                        <div>
                            <el-tooltip
                                class="item"
                                effect="dark"
                                content="点击跳转地图查询"
                                placement="top-start"
                            >
                                <el-link
                                    :underline="false"
                                    href="https://map.baidu.com"
                                    target="_blank"
                                >{{formData.areaCode | areaFormatter}}{{ formData.fullAddress }}
                                </el-link>
                            </el-tooltip>
                            <el-button
                                type="text"
                                v-waves
                                icon="el-icon-edit"
                                @click="formOpenAddress"
                            >修改</el-button>
                            <el-button
                                type="text"
                                v-waves
                                icon="el-icon-document-copy"
                                @click="handleClipboard(areaFormatter(formData.areaCode) + formData.fullAddress, $event)"
                            >拷贝</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <div class="pay-header">
                <h3>
                    <svg-icon icon-class="icon_order_payment" /> 支付信息</h3>
                <canvas
                    id="payStatus"
                    class="pay-status"
                    width="150"
                    height="100"
                ></canvas>
            </div>
            <el-form
                label-position="left"
                label-width="120px"
                inline
                class="basic-table"
            >
                <el-form-item
                    label="支付方式"
                    prop="paymentMethod"
                >
                    <span v-if="cacheData.statusMap">{{ formData.paymentMethod | statusFilter(cacheData.statusMap['1008'])}}</span>
                </el-form-item>
                <el-form-item
                    label="支付渠道"
                    prop="paymentChannel"
                >
                    <span v-if="cacheData.statusMap">{{ formData.paymentChannel | statusFilter(cacheData.statusMap['1011'])}}</span>
                </el-form-item>
                <el-form-item
                    label="支付状态"
                    prop="payStatus"
                >
                    <span
                        class="green"
                        v-if="cacheData.statusMap"
                    >{{ formData.payStatus | statusFilter(cacheData.statusMap['1013'])}}</span>
                </el-form-item>
                <el-form-item
                    label="微信支付订单号"
                    prop="transactionId"
                >
                    <span>{{ formData.transactionId }}</span>
                </el-form-item>
            </el-form>
        </el-row>

        <div class="base-header">
            <h3>
                <svg-icon icon-class="goods" /> 商品清单</h3>
        </div>
        <div class="actions-container">
        </div>
        <el-table
            :data="formData.items"
            border
            fit
            style="width: 100%;"
        >
            <el-table-column
                label="商品图"
                align="center"
            >
                <template slot-scope="scope">
                    <img
                        :src="scope.row.thumbnail"
                        class="user-avatar"
                    >
                </template>
            </el-table-column>

            <el-table-column
                label="商品名称"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.goodsName }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="规格名称"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.skuName }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="价格"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.sellingPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="数量"
                align="center"
            >
                <template slot-scope="scope">
                    <!-- <add-subtractor :quantity.sync="scope.row.quantity" /> -->
                    <span>{{ scope.row.quantity }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="买家备注"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.message }}</span>
                </template>
            </el-table-column>
        </el-table>

        <el-row>
            <el-form
                label-width="120px"
                inline
                class="total-table"
            >
                <el-form-item
                    label="商品金额"
                    prop="totalAmount"
                >
                    <span>{{ formData.totalAmount | priceFormatter }}</span>
                </el-form-item>
                <el-form-item
                    label="优惠金额"
                    prop="discountedAmount"
                >
                    <span class="red">{{ formData.discountedAmount | priceFormatter }}</span>
                </el-form-item>
                <el-form-item
                    label="运费"
                    prop="deliveryAmount"
                >
                    <span class="red">{{ formData.deliveryAmount | priceFormatter }}</span>
                </el-form-item>
                <el-form-item
                    label="实付款"
                    prop="paidAmount"
                >
                    <span class="red">{{ formData.paidAmount | priceFormatter}}</span>
                </el-form-item>
            </el-form>
        </el-row>

        <el-dialog
            :center="true"
            title="订单处理"
            :visible.sync="formVisible"
            @close="formClose"
        >
            <el-form
                ref="formDataStatus"
                :center="true"
                :rules="rules"
                :model="formDataStatus"
                label-width="120px"
            >
                <el-form-item
                    v-if="formData.statusId == 'SUBMIT_ONLINE'"
                    label="实际支付金额"
                >
                    <el-input
                        v-model="formDataStatus.paidAmount"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                        type="textarea"
                        v-model="formDataStatus.remark"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer">
                <el-button @click="formClose">{{ $t('table.cancel') }}</el-button>
                <el-button
                    waves
                    type="primary"
                    @click="handleFormSave"
                >{{ $t('table.confirm') }}</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="地图"
            :visible.sync="formVisibleMap"
        >
            <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
                <bm-search :selected.sync="mapSelected"></bm-search>
            </el-row>
        </el-dialog>
        <el-dialog
            title="地址修改"
            :visible.sync="formVisibleAddress"
        >
            <el-form
                ref="formDataAddress"
                label-width="120px"
            >
                <el-form-item label="省/地区">
                    <cascader-area
                        :selected.sync="areaSelected"
                        :lazy="false"
                    ></cascader-area>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input
                        type="textarea"
                        v-model="formData.fullAddress"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer">
                <div>
                    <el-button
                        waves
                        type="primary"
                        @click="formCloseAddress"
                    >{{ $t('table.confirm') }}</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import CascaderArea from '@/components/CascaderArea'
import waves from '@/directive/waves' // Waves directive
import SysCode from '@/components/SysCode'
import { cacheData, cacheSelectOptionsData } from '@/utils/cache'
import DySelect from '@/components/DySelect'
import {
    orderDetail,
    orderUpdate,
    orderPaidOffline,
    orderConfirm,
    orderDelivery,
    orderReceipt,
    orderHandleAll,
    orderUpdateStatus
} from '@/api/order'
import FormDialog from '@/components/FormDialog'
import { uuid } from 'vue-uuid'
import clipboard from '@/utils/clipboard'
import { areaFormatter } from '@/utils/index'
import BmSearch from '@/components/BmSearch'
import AddSubtractor from '@/components/AddSubtractor'
import { statusSealRect } from '@/utils/seal'
import { resolve, reject } from 'q'

const defaultFormDataStatus = {
    orderId: null,
    orderNo: null,
    remark: '',
    nextStatusId: '',
    paidAmount: 0
}
export default {
    name: 'orderBasic',
    components: {
        SysCode,
        DySelect,
        FormDialog,
        Sticky,
        CascaderArea,
        BmSearch,
        AddSubtractor
    },
    directives: { waves },
    filters: {
        priceFormatter(value) {
            if (!value) {
                return '¥0.00'
            }
            return '¥' + value.toFixed(2)
        }
    },
    data() {
        return {
            cacheData: {},
            formData: {
                id: '',
                remark: '',
                status: '',
                cityId: '',
                countryId: '',
                deliveryMethod: '',
                discountedAmount: 0,
                fullAddress: '',
                areaCode: '',
                openId: '',
                orderNo: '',
                paidAmount: 0,
                payStatus: '',
                paymentChannel: '',
                paymentMethod: '',
                phoneNo: '',
                provinceId: '',
                realName: '',
                statusId: '',
                totalAmount: 0,
                transactionId: '',
                uid: '',
                items: []
            },
            eventType: null,
            areaSelected: [],
            formDataStatus: defaultFormDataStatus,
            formVisible: false,
            loading: false,
            formVisibleMap: false,
            formVisibleAddress: false,
            mapSelected: {},
            rules: {}
        }
    },
    computed: {},
    mounted() {
        cacheSelectOptionsData(this.cacheData, 'ORDER_STATUS').then(() => {})
        cacheData(this.cacheData, '1008,1009,1010,1011,1013').then(() => {
            this.handleFilter(this.$route.params.orderId, this.$route.params.by)
        })
    },
    methods: {
        areaFormatter,
        handleFilter(orderId, by) {
            this.handleQuery(orderId, by).then(data => {
                if (
                    data.payStatus &&
                    (data.payStatus == '101301' || data.payStatus == '101306')
                ) {
                    statusSealRect('payStatus', '已付款')
                } else if (data.payStatus && data.payStatus == '101307') {
                    statusSealRect('payStatus', '已退款', '#666666')
                }
            })
        },
        handleQuery(orderId, by) {
            return new Promise((resolve, reject) => {
                orderDetail(orderId, by).then(data => {
                    if (!data) {
                        return
                    }
                    this.formData = data
                    resolve(data)
                    this.areaSelected = this.toAreaSelected(
                        this.formData.areaCode
                    )
                })
            })
        },
        formOpenMap(location) {
            this.formVisibleMap = true
        },
        formOpenAddress() {
            this.formVisibleAddress = true
        },
        formCloseAddress() {
            this.formVisibleAddress = false
            this.formData.areaCode = this.toAreaCode()
        },
        // 打开Form表单
        formOpen(eventType) {
            this.formVisible = true
            this.eventType = eventType
            if (this.formData.statusId === 'SUBMIT_ONLINE') {
                this.formDataStatus.paidAmount = this.formData.totalAmount
                this.formDataStatus.nextStatusId = 'PAID'
            } else if (this.formData.statusId === 'PAID') {
                this.formDataStatus.nextStatusId = 'CONFIRMED'
            } else if (this.formData.statusId === 'CONFIRMED') {
                this.formDataStatus.remark = '您好！您的订单已由送货员【】配送，请您耐心等待，联系电话【】'
                this.formDataStatus.nextStatusId = 'DELIVERING'
            } else if (this.formData.statusId === 'DELIVERING') {
                this.formDataStatus.nextStatusId = 'RECEIPTED'
            }
        },
        // 关闭Form表单
        formClose() {
            this.formVisible = false
            this.eventType = null
            this.$refs['formDataStatus'].resetFields()
            this.formDataStatus = defaultFormDataStatus
        },
        // 表单提交处理
        handleFormSave() {
            this.$refs['formDataStatus'].validate(valid => {
                if (valid) {
                    this.loading = true
                    this.formDataStatus.orderId = this.$route.params.orderId
                    console.log(this.eventType)
                    orderHandleAll(this.eventType, this.formDataStatus)
                        .then(data => {
                            this.formVisible = false
                            this.formDataStatus = defaultFormDataStatus
                            this.handleQuery(
                                this.$route.params.orderId,
                                this.$route.params.by
                            )
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success',
                                duration: 2000
                            })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        .finally(() => {
                            this.loading = false
                        })
                } else {
                    return false
                }
            })
        },
        handleClipboard(text, event) {
            clipboard(text, event)
        },
        toAreaSelected(areaCode) {
            let province = areaCode.substring(0, 2) + '0000'
            let city = areaCode.substring(0, 4) + '00'
            let areaSelected = []
            areaSelected[0] = province
            areaSelected[1] = city
            areaSelected[2] = areaCode
            return areaSelected
        },
        toAreaCode() {
            return this.areaSelected[2]
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.sub-navbar-sticky {
    height: 50px;
    line-height: 50px;
    position: relative;
    width: 100%;
    text-align: right;
    padding-right: 20px;
    transition: 600ms ease position;
    background: linear-gradient(
        90deg,
        rgb(222, 235, 241) 0%,
        rgb(221, 235, 241) 0%,
        rgb(237, 238, 240) 100%,
        rgb(44, 59, 80) 100%
    );
    .subtitle {
        font-size: 20px;
        color: #fff;
    }
}
.action-header {
    margin-top: -20px;
    float: right;
}
.pay-header {
}
.pay-status {
    float: right;
}
.red {
    color: red;
    display: block;
    width: 50px;
    float: left;
    text-align: right;
}
.green {
    color: #30b08f;
}
.total-table {
    margin-top: 25px;
    font-size: 0;
}
.total-table label {
    width: 90px;
    color: #99a9bf;
}
.total-table .el-form-item {
    margin-left: 85%;
    margin-bottom: 0;
    width: 100%;
}

.basic-table {
    font-size: 0;
}
.basic-table label {
    width: 90px;
    color: #99a9bf;
}
.basic-table .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.tab-container {
    position: relative;
    padding: 40px 30px;
}
.user-avatar {
    width: 40px;
    height: 40px;
}
</style>
