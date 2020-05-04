<template>
    <div class="tab-container">
        <h3>
            <svg-icon icon-class="menu" /> 基本信息</h3>
        <el-form
            ref="formData"
            :rules="rules"
            :model="formData"
            label-width="120px"
        >
            <el-form-item
                label="商户"
                prop="merchantNo"
            >
                <dy-select
                    :placeholder="'请选择商户'"
                    :disabled='true'
                    :selected.sync="formData.merchantNo"
                    :selectType="'MERCHANT'"
                >
                </dy-select>
            </el-form-item>
            <el-form-item
                label="商品编号"
                prop="goodsNo"
            >
                <el-input
                    v-model="formData.goodsNo"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="缩略图"
                prop="thumbnail"
            >
                <upload-image
                    @input="updateThumbnailUrl"
                    :value="formData.thumbnail || ''"
                    :domain="'goods'"
                    :businessNo="formData.id"
                    :businessType="'101500'"
                ></upload-image>
            </el-form-item>
            <el-form-item
                label="商品名称"
                prop="goodsName"
            >
                <el-input
                    v-model="formData.goodsName"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="月销量"
                prop="salesVolume"
            >
                <el-input
                    v-model="formData.salesVolume"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="商品库存"
                prop="stockNum"
            >
                <el-input
                    v-model="formData.stockNum"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="热销"
                prop="hot"
            >
                <el-radio-group v-model="formData.hot">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                label="标签"
                prop="tags"
            >
                <el-radio-group v-model="formData.tags">
                    <el-radio :label="'热销'">热销</el-radio>
                    <el-radio :label="'力推'">力推</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                label="商品参数"
                prop="goodsParams"
            >
                <el-button
                    class="action-item"
                    type="text"
                    v-waves
                    icon="el-icon-edit"
                    @click="formOpenParams"
                >点击进行编辑</el-button>
            </el-form-item>
            <el-form-item
                label="原价"
                prop="marketPrice"
            >
                <el-input
                    v-model="formData.marketPrice"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="卖价"
                prop="sellingPrice"
            >
                <el-input
                    v-model="formData.sellingPrice"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="商品介绍"
                prop="description"
            >
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 10}"
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
        </el-form>
        <h3>
            <svg-icon icon-class="menu" /> 商品规格</h3>
        <!--商品规格-->
        <el-row class="group-tag">
            <el-tag
                class="tag"
                :key="item.id"
                v-for="item in attrs"
                closable
                :disable-transitions="false"
                @close="handleRemoveGroup(item.id)"
            >
                {{item.name}}({{item.byOrder}})
            </el-tag>
            <el-button
                class="action-item"
                size="small"
                v-waves
                icon="el-icon-plus"
                @click="formOpenGroup"
            >新增</el-button>
        </el-row>
        <div class="actions-container">
            <el-row>
                <el-col :span="20">
                    <el-button
                        class="action-item"
                        size="small"
                        v-waves
                        icon="el-icon-plus"
                        @click="formOpenAttrValue"
                    >{{ $t('table.add') }}</el-button>
                </el-col>
                <el-col :span="4">
                </el-col>
            </el-row>
        </div>
        <el-table
            :data="attrsValues"
            border
            fit
            highlight-current-row
            style="width: 100%;"
        >
            <el-table-column
                label="属性"
                align="center"
                width="200px"
            >
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="规格"
                align="center"
                width="200px"
            >
                <template slot-scope="scope">
                    <span>{{attrValueFilter(scope.row.attrId)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="图片"
                align="center"
            >
                <template slot-scope="scope">
                    <img
                        class="avatar"
                        :src="scope.row.imgUrl"
                    >
                </template>
            </el-table-column>
            <el-table-column
                label="排序"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{scope.row.byOrder}}</span>
                </template>
            </el-table-column>
            <el-table-column
                :label="$t('table.actions')"
                align="center"
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
                            @click="formOpenAttrValue(scope.row, true)"
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
                            @click="handleRemoveAttrValue(scope.row.id)"
                        ></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <form-dialog
            :visible.sync='formVisibleGroup'
            :title="isEditGroup? $t('table.edit'):$t('table.add')"
            @onCancel="formCloseGroup"
            @onSubmit="handleFormSaveGroup"
        >
            <el-form
                ref="formDataGroup"
                :rules="rulesGroup"
                :model="formDataGroup"
                label-width="120px"
            >
                <el-form-item
                    label="商品ID"
                    prop="goodsId"
                >
                    <el-input
                        :disabled="true"
                        v-model="formDataGroup.goodsId"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="规格名称"
                    prop="name"
                >
                    <el-input
                        v-model="formDataGroup.name"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="排序"
                    prop="byOrder"
                >
                    <el-input
                        v-model="formDataGroup.byOrder"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
        </form-dialog>

        <form-dialog
            :visible.sync='formVisibleAttrValue'
            :title="isEditAttrValue? $t('table.edit'):$t('table.add')"
            @onCancel="formCloseAttrValue"
            @onSubmit="handleFormSaveAttrValue"
        >
            <el-form
                ref="formDataAttrValue"
                :rules="rulesAttrValue"
                :model="formDataAttrValue"
                label-width="120px"
            >
                <el-form-item
                    label="规格"
                    prop="attrId"
                >
                    <el-select
                        style="width: 100%;"
                        v-model="formDataAttrValue.attrId"
                        placeholder="请选择规格"
                    >
                        <el-option
                            v-for="item in attrs"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="属性"
                    prop="name"
                >
                    <el-input
                        v-model="formDataAttrValue.name"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="图片"
                    prop="imgUrl"
                >
                    <upload-image
                        @input="updateImgUrl"
                        :value="formDataAttrValue.imgUrl"
                        :domain="'goods'"
                        :businessNo="formData.id"
                        :businessType="'101500'"
                    ></upload-image>
                </el-form-item>
                <el-form-item
                    label="排序"
                    prop="byOrder"
                >
                    <el-input
                        v-model="formDataAttrValue.byOrder"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
        </form-dialog>
        <h3>
            <svg-icon icon-class="menu" /> 商品SKU</h3>
        <div class="actions-container">
            <el-row>
                <el-col :span="18">
                    <el-button
                        class="action-item"
                        size="small"
                        v-waves
                        icon="el-icon-plus"
                        @click="formOpenSku"
                    >{{ $t('table.add') }}</el-button>
                </el-col>
                <el-col :span="6">
                </el-col>
            </el-row>
        </div>
        <el-table
            :data="skus"
            border
            fit
            style="width: 100%;"
        >
            <el-table-column
                label="Sku名称"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.skuName }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="成本价"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.costPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="原价"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.marketPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="卖价"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.sellingPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="图片"
                align="center"
            >
                <template slot-scope="scope">
                    <img
                        class="avatar"
                        :src="scope.row.imgUrl"
                    >
                </template>
            </el-table-column>
            <el-table-column
                label="排序"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.byOrder }}</span>
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
                            @click="formOpenSku(scope.row, true)"
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
                            @click="handleRemoveSku(scope.row.id)"
                        ></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <form-dialog
            :visible.sync='formVisibleSku'
            :title="$t('table.add')"
            @onCancel="formCloseSku"
            @onSubmit="handleFormSaveSku"
        >
            <el-form
                ref="formDataSku"
                :rules="rulesSku"
                :model="formDataSku"
                label-width="120px"
            >
                <el-form-item
                    label="商品ID"
                    prop="goodsId"
                >
                    <el-input
                        :disabled="true"
                        v-model="formDataSku.goodsId"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="Sku名称"
                    prop="skuName"
                >
                    <el-input
                        v-model="formDataSku.skuName"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="图片"
                    prop="imgUrl"
                >
                    <upload-image
                        @input="updateSkuImgUrl"
                        :value="formDataSku.imgUrl"
                        :domain="'goods'"
                        :businessNo="formData.id"
                        :businessType="'101500'"
                    ></upload-image>
                </el-form-item>
                <el-form-item
                    label="属性"
                    prop="attrId"
                >
                    <el-select
                        style="width: 100%;"
                        v-model="formDataSku.valueIds"
                        :multiple="true"
                        placeholder="请选择属性"
                    >
                        <el-option
                            v-for="item in attrsValues"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="成本价"
                    prop="costPrice"
                >
                    <el-input
                        v-model="formDataSku.costPrice"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="原价"
                    prop="marketPrice"
                >
                    <el-input
                        v-model="formDataSku.marketPrice"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="卖价"
                    prop="sellingPrice"
                >
                    <el-input
                        v-model="formDataSku.sellingPrice"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="库存"
                    prop="sellingPrice"
                >
                    <el-input
                        v-model="formDataSku.stockNum"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="Sku参数"
                    prop="skuParams"
                >
                    <el-input
                        type="textarea"
                        v-model="formDataSku.skuParams"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="排序"
                    prop="byOrder"
                >
                    <el-input
                        v-model="formDataSku.byOrder"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input
                        type="textarea"
                        v-model="formDataSku.remark"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
        </form-dialog>
        <goods-params
            v-if="paramsReady"
            :visible.sync='formVisibleParams'
            :value='formData.goodsParams'
            title="商品参数"
            @onCancel="formCloseParams"
            @onSubmit="handleFormSaveParams"
        >
        </goods-params>

        <h3>
            <svg-icon icon-class="menu" /> 商品详情</h3>
        <div>
            <tinymce
                :height="300"
                :domain="'goods'"
                :businessNo="formData.id"
                :businessType="'101500'"
                v-model="formData.content"
            />
        </div>
        <div
            class="editor-content"
            v-html="formData.content"
        />
        <div>
            <el-button
                waves
                type="primary"
                @click="handleFormSave"
            >{{ $t('table.submit') }}</el-button>
        </div>
    </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import Tinymce from '@/components/Tinymce'
import UploadImage from '@/components/Upload/uploadImage'
import SysCode from '@/components/SysCode'
import { cacheData } from '@/utils/cache'
import DySelect from '@/components/DySelect'
import { goodsDetail, goodsUpdate } from '@/api/goods'
import FormDialog from '@/components/FormDialog'
import { uuid } from 'vue-uuid'
import GoodsParams from './goodsParams'

export default {
    name: 'goodsBasic',
    components: {
        SysCode,
        DySelect,
        Tinymce,
        FormDialog,
        UploadImage,
        GoodsParams
    },
    directives: { waves },
    filters: {},
    data() {
        return {
            cacheData: {},
            formData: {
                id: null,
                remark: '',
                status: '',
                description: '',
                thumbnail: '',
                goodsName: '',
                marketPrice: 0,
                sellingPrice: 0,
                goodsNo: '',
                merchantNo: '',
                stockNum: 0,
                hot: false,
                tags: '',
                salesVolume: 0,
                categoryId: '',
                content: ''
            },
            formVisibleParams: false,
            formVisibleSku: false,
            formVisibleAttrValue: false,
            paramsReady: false,
            formDataSku: {
                goodsId: '',
                skuName: '',
                skuParams: '',
                imgUrl: '',
                costPrice: 0,
                marketPrice: 0,
                sellingPrice: 0,
                remark: '',
                stockNum: 0,
                valueIds: [],
                id: null,
                byOrder: 0
            },
            skus: [],
            attrs: [],
            attrsValues: [],
            formVisibleGroup: false,
            isEditSku: false,
            isEditGroup: false,
            isEditAttrValue: false,
            formDataGroup: {
                id: '',
                goodsId: '',
                ks: '',
                name: '',
                byOrder: 0
            },
            formDataAttrValue: {
                id: '',
                attrId: '',
                imgUrl: '',
                name: '',
                byOrder: 0
            },
            loading: false,
            rules: {
                merchantNo: [
                    {
                        required: true,
                        message: '商户编号必选择',
                        trigger: 'blur'
                    }
                ],
                goodsName: [
                    {
                        required: true,
                        message: '名称必填',
                        trigger: 'blur'
                    }
                ],
                goodsNo: [
                    {
                        required: true,
                        message: '编号必填',
                        trigger: 'blur'
                    }
                ]
            },
            rulesSku: {
                skuName: [
                    {
                        required: true,
                        message: 'Sku名称',
                        trigger: 'blur'
                    }
                ],
                costPrice: [
                    {
                        required: true,
                        message: '成本价',
                        trigger: 'blur'
                    }
                ],
                marketPrice: [
                    {
                        required: true,
                        message: '原价',
                        trigger: 'blur'
                    }
                ],
                sellingPrice: [
                    {
                        required: true,
                        message: '卖价',
                        trigger: 'blur'
                    }
                ]
            },
            rulesGroup: {
                name: [
                    {
                        required: true,
                        message: '名称必填',
                        trigger: 'blur'
                    }
                ]
            },
            rulesAttrValue: {
                name: [
                    {
                        required: true,
                        message: '名称必填',
                        trigger: 'blur'
                    }
                ],
                attrId: [
                    {
                        required: true,
                        message: '规格必选',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    computed: {},
    mounted() {
        cacheData(this.cacheData, '1000').then(() => {
            goodsDetail(this.$route.params.goodsId).then(data => {
                if (!data) {
                    return
                }
                this.formData = data.basic
                this.skus = data.skus || []
                this.attrs = data.attrs || []
                this.attrsValues = data.attrsValues || []
                this.paramsReady = true
            })
        })
    },
    methods: {
        attrValueFilter(attrId) {
            let attr = this.attrs.filter(v => attrId == v.id)[0]
            if (!attr) {
                return '无'
            }
            return attr.name
        },
        // 表单提交处理
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    this.loading = true
                    let data = {
                        basic: this.formData,
                        skuDtos: this.skus,
                        attrs: this.attrs,
                        attrsValues: this.attrsValues,
                        remark: '更新商品'
                    }
                    goodsUpdate(this.$route.params.goodsId, data)
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
        // =================商品sku===========
        formOpenSku(row, isEdit = false) {
            this.isEditSku = isEdit
            this.formVisibleSku = true
            if (isEdit) {
                this.formDataSku = Object.assign({}, row)
            } else {
                this.formDataSku = {}
                this.formDataSku.id = uuid.v4().replace(/-/g, '')
                this.formDataSku.goodsId = this.$route.params.goodsId
            }
        },
        formCloseSku() {
            this.formVisibleSku = false
            this.$refs['formDataSku'].resetFields()
        },
        handleFormSaveSku() {
            this.$refs['formDataSku'].validate(valid => {
                if (valid) {
                    this.skus = this.skus.filter(
                        v => this.formDataSku.id != v.id
                    )
                    this.skus.push(Object.assign({}, this.formDataSku))
                    this.formVisibleSku = false
                } else {
                    return false
                }
            })
        },
        handleRemoveSku(skuId) {
            this.$confirm(`确认删除这条记录？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.skus = this.skus.filter(v => skuId != v.id)
            })
        },

        //==================商品规格============================
        // 打开Form表单
        formOpenGroup(row, isEdit = false) {
            this.isEditGroup = isEdit
            this.formVisibleGroup = true
            if (isEdit) {
                this.formDataGroup = Object.assign({}, row)
            } else {
                this.formDataGroup = {}
                this.formDataGroup.id = uuid.v4().replace(/-/g, '')
                this.formDataGroup.goodsId = this.$route.params.goodsId
            }
        },
        // 关闭Form表单
        formCloseGroup() {
            this.formVisibleGroup = false
            this.$refs['formDataGroup'].resetFields()
        },
        handleRemoveGroup(id) {
            this.$confirm(`确认删除所有关联属性？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let attr = this.attrs.filter(v => id == v.id)[0]
                if (attr) {
                    this.attrsValues = this.attrsValues.filter(
                        v => attr.id != v.attrId
                    )
                }
                this.attrs = this.attrs.filter(v => id != v.id)
            })
        },
        // 表单提交处理
        handleFormSaveGroup() {
            this.$refs['formDataGroup'].validate(valid => {
                if (valid) {
                    this.attrs = this.attrs.filter(
                        v => this.formDataGroup.id != v.id
                    )
                    this.attrs.push(Object.assign({}, this.formDataGroup))
                    this.formVisibleGroup = false
                }
            })
        },
        //========商品属性==========
        formOpenAttrValue(row, isEdit = false) {
            this.isEditAttrValue = isEdit
            this.formVisibleAttrValue = true
            if (isEdit) {
                this.formDataAttrValue = Object.assign({}, row)
            } else {
                this.formDataAttrValue = {}
                this.formDataAttrValue.id = uuid.v4().replace(/-/g, '')
            }
        },
        // 关闭Form表单
        formCloseAttrValue() {
            this.formVisibleAttrValue = false
            this.$refs['formDataAttrValue'].resetFields()
        },
        handleRemoveAttrValue(id) {
            this.$confirm(`确认删除这条记录？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.attrsValues = this.attrsValues.filter(v => id != v.id)
            })
        },
        // 表单提交处理
        handleFormSaveAttrValue() {
            this.$refs['formDataAttrValue'].validate(valid => {
                if (valid) {
                    this.attrsValues = this.attrsValues.filter(
                        v => this.formDataAttrValue.id != v.id
                    )
                    this.attrsValues.push(
                        Object.assign({}, this.formDataAttrValue)
                    )
                    this.formVisibleAttrValue = false
                }
            })
        },
        formOpenParams() {
            this.formVisibleParams = true
        },
        formCloseParams() {
            this.formVisibleParams = false
        },
        handleFormSaveParams(value) {
            this.formData.goodsParams = value
            this.formCloseParams()
        },
        updateImgUrl(value) {
            this.formDataAttrValue.imgUrl = value.imgUrl
        },
        updateSkuImgUrl(value) {
            this.formDataSku.imgUrl = value.imgUrl
        },
        updateThumbnailUrl(value) {
            this.formData.thumbnail = value.imgUrl
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
.group-tag {
    padding-bottom: 20px;
    .tag {
        margin-left: 5px;
    }
}
.avatar {
    width: 80px;
    height: 60px;
}
</style>
