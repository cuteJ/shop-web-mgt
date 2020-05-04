<template>
    <div class="tab-container">
        <el-form
            ref="formData"
            :rules="rules"
            :model="formData"
            label-width="120px"
        >
            <el-form-item
                label="商户编号"
                prop="merchantNo"
            >
                <el-input
                    v-model="formData.merchantNo"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="商户名称"
                prop="merchantName"
            >
                <el-input
                    :disabled="true"
                    v-model="formData.merchantName"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="公众号微信"
                prop="merchantWx"
            >
                <el-input
                    v-model="formData.merchantWx"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="微信名称"
                prop="nickName"
            >
                <el-input
                    v-model="formData.nickName"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="OpenId"
                prop="openId"
            >
                <el-button
                    v-if="!formData.openId"
                    plain
                    @click="bindWechat"
                >点击绑定</el-button>
                <el-input
                    v-else
                    :disabled="true"
                    v-model="formData.openId"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item label="销售地区">
                <el-button
                    plain
                    @click="openFormLimitArea"
                >设置地区</el-button>
            </el-form-item>
            <el-form-item
                label="联系人手机号"
                prop="phoneNo"
            >
                <el-input
                    v-model="formData.phoneNo"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="联系人邮箱"
                prop="email"
            >
                <el-input
                    v-model="formData.email"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="商户地址"
                prop="address"
            >
                <el-input
                    v-model="formData.address"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item label="退款原因">
                <el-row class="group-tag">
                    <el-tag
                        class="tag"
                        :key="item.id"
                        v-for="item in refundReasons"
                        closable
                        :disable-transitions="false"
                        @close="handleRemoveReason(item.id)"
                    >
                        {{item.reason}}
                    </el-tag>
                    <el-button
                        class="action-item"
                        size="small"
                        v-waves
                        icon="el-icon-plus"
                        @click="formOpenRefundReason"
                    ></el-button>
                </el-row>
            </el-form-item>
            <el-form-item
                type="textarea"
                label="商户介绍"
                prop="description"
            >
                <el-input
                    v-model="formData.description"
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
            <div>
                <el-form-item>
                    <el-button
                        waves
                        type="primary"
                        @click="handleFormSave"
                    >{{ $t('table.submit') }}</el-button>
                </el-form-item>
            </div>
        </el-form>

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

        <el-dialog
            title="设置销售地区"
            :visible.sync="limitFormVisible"
            @close="handleLimitCancel"
        >
            <el-form
                ref="formDataAddress"
                label-width="120px"
            >
                <el-form-item label="可配送地区">
                    <cascader-area
                        :selected.sync="areaSelected"
                        :props="props"
                        :lazy="false"
                    ></cascader-area>
                </el-form-item>
            </el-form>
            <div class="dialog-footer">
                <div class="footer-btn">
                    <el-button
                        waves
                        type="primary"
                        @click="handleSaveLimitArea"
                    >{{ $t('table.confirm') }}</el-button>
                    <el-button @click="handleLimitCancel">{{ $t('table.cancel') }}</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog
            title="添加退款原因"
            :visible.sync="reasonFormVisible"
            @close="handleReasonCancel"
        >
            <el-form
                ref="formDataReason"
                label-width="120px"
            >
                <el-form-item label="原因">
                    <el-input
                        v-model="formDataReason.reason"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer">
                <div class="footer-btn">
                    <el-button
                        waves
                        type="primary"
                        @click="handleFormReasonSave"
                    >{{ $t('table.confirm') }}</el-button>
                    <el-button @click="handleReasonCancel">{{ $t('table.cancel') }}</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import SysCode from '@/components/SysCode'
import CascaderArea from '@/components/CascaderArea'
import waves from '@/directive/waves' // Waves directive
import { cacheData } from '@/utils/cache'
import {
    merchantBasic,
    merchantSave,
    wxLogin,
    limitAreaList,
    limitAreaSave,
    refundReasonsList,
    refundReasonSave,
    removeRefundReason
} from '@/api/merchant'

export default {
    name: 'merchantBasic',
    components: { SysCode, CascaderArea },
    directives: { waves },
    data() {
        return {
            cacheData: {},
            formData: {
                id: null,
                merchantNo: '',
                merchantName: '',
                openId: '',
                nickName: '',
                merchantWx: '',
                phoneNo: '',
                email: '',
                address: '',
                description: ''
            },
            loading: false,
            wxFormVisible: false,
            limitFormVisible: false,
            reasonFormVisible: false,
            id: null,
            wxQrImg: '',
            timer: null,
            areaSelected: [],
            refundReasons: [],
            props: { multiple: true },
            formDataReason: {
                id: null,
                merchantNo: '',
                reason: ''
            },
            rules: {
                merchantNo: [
                    {
                        required: true,
                        message: '商户编号必选择',
                        trigger: 'blur'
                    }
                ],
                merchantWx: [
                    {
                        required: true,
                        message: '公众号微信必填',
                        trigger: 'blur'
                    }
                ],
                merchantName: [
                    {
                        required: true,
                        message: '商户名称必填',
                        trigger: 'blur'
                    }
                ],
                phoneNo: [
                    {
                        required: true,
                        message: '联系人手机号必填',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    computed: {},
    mounted() {
        cacheData(this.cacheData, '1000').then(() => {
            merchantBasic(this.$route.params.merchantNo).then(data => {
                this.formData = data
            })
            this.handleQueryReasonList()
        })
    },
    methods: {
        // 表单提交处理
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    this.loading = true
                    merchantSave(this.formData)
                        .then(data => {
                            this.$notify({
                                title: '成功',
                                message: '保存成功',
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
        bindWechat() {
            wxLogin(this.$route.params.merchantNo)
                .then(data => {
                    this.wxFormVisible = true
                    this.wxQrImg = `http://qr.topscan.com/api.php?&w=400&text=${
                        data.value
                    }`
                    // 轮询结果
                    this.timer = setInterval(() => {
                        merchantBasic(this.$route.params.merchantNo).then(
                            data => {
                                this.formData = data
                                if (data.openId) {
                                    this.$notify({
                                        title: '成功',
                                        message: '授权成功',
                                        type: 'success',
                                        duration: 2000
                                    })
                                    this.wxFormVisible = false
                                }
                            }
                        )
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
        },
        openFormLimitArea() {
            limitAreaList({
                merchantNo: this.$route.params.merchantNo,
                limitType: '102000'
            }).then(data => {
                this.limitFormVisible = true
                if (data && data.length > 0 && data[0].areaCodes) {
                    let areaSelected = []
                    this.id = data[0].id
                    for (let i = 0; i < data[0].areaCodes.length; i++) {
                        let areaCode = data[0].areaCodes[i]
                        let province = areaCode.substring(0, 2) + '0000'
                        let city = areaCode.substring(0, 4) + '00'
                        areaSelected.push([province, city, areaCode])
                    }
                    this.areaSelected = areaSelected
                }
            })
        },
        formOpenRefundReason() {
            this.reasonFormVisible = true
        },
        handleLimitCancel() {
            this.limitFormVisible = false
        },
        handleSaveLimitArea() {
            console.log(this.areaSelected)
            let provinceCodes = []
            let cityCodes = []
            let areaCodes = []
            for (let i = 0; i < this.areaSelected.length; i++) {
                provinceCodes.push(this.areaSelected[i][0])
                cityCodes.push(this.areaSelected[i][1])
                areaCodes.push(this.areaSelected[i][2])
            }
            let formData = {
                provinceCodes: Array.from(new Set(provinceCodes)),
                cityCodes: Array.from(new Set(cityCodes)),
                areaCodes: Array.from(new Set(areaCodes)),
                id: this.id,
                domainId: '100',
                merchantNo: this.$route.params.merchantNo,
                limitType: '102000'
            }
            limitAreaSave(formData).then(() => {
                this.limitFormVisible = false
            })
        },
        handleReasonCancel() {
            this.reasonFormVisible = false
            this.$refs['formDataReason'].resetFields()
        },
        handleQueryReasonList() {
            refundReasonsList(this.$route.params.merchantNo).then(data => {
                this.refundReasons = data
            })
        },
        handleFormReasonSave() {
            this.formDataReason.merchantNo = this.$route.params.merchantNo
            refundReasonSave(this.formDataReason).then(data => {
                this.handleQueryReasonList()
                this.reasonFormVisible = false
            })
        },
        handleRemoveReason(id) {
            this.$confirm(`确认删除？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                removeRefundReason(id).then(data => {
                    this.handleQueryReasonList()
                })
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
.footer-btn {
    margin-top: 50px;
    margin-left: 120px;
}
.group-tag {
    padding-bottom: 20px;
    .tag {
        margin-left: 5px;
    }
}
</style>
