<template>
  <div class="app-container">
    <el-row class="action">
      <el-button
        class="action-item"
        size="small"
        v-waves
        icon="el-icon-plus"
        @click="formOpen"
      >新增</el-button>
    </el-row>
    <el-row :gutter="10">
      <el-col
        :span="8"
        v-for="pic in pictures"
        :key="pic.id"
      >
        <!-- <span class="demonstration">{{ pic.imgDesc }}</span> -->
        <el-image
          style="width: 100%; height: 300px"
          :src="pic.imgUrl"
          :alt="pic.imgDesc"
        >
        </el-image>
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
            @click="formOpen(pic, true)"
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
            @click="handleRemove(pic.id)"
          ></el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row>
      <el-button
        waves
        type="primary"
        @click="handleRemoteSave"
      >{{ $t('table.submit') }}</el-button>
    </el-row>
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
          label="商品ID"
          prop="goodsId"
        >
          <el-input
            :disabled="true"
            v-model="formData.goodsId"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="图片"
          prop="imgUrl"
        >
          <upload-image
            @input="updateImgUrl"
            :value="formData.imgUrl || ''"
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
            v-model="formData.byOrder"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="描述"
          prop="imgDesc"
        >
          <el-input
            type="textarea"
            v-model="formData.imgDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
    </form-dialog>
  </div>
</template>

<script>
import { goodsPictures, goodsPicturesRemove, goodsUpdatePic } from '@/api/goods'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import SysCode from '@/components/SysCode'
import FormDialog from '@/components/FormDialog'
import UploadImage from '@/components/Upload/uploadImage'
import { cacheData } from '@/utils/cache'
import { uuid } from 'vue-uuid'

export default {
    name: 'goodsPictures',
    components: {
        SysCode,
        FormDialog,
        UploadImage
    },
    directives: { waves },
    filters: {},
    data() {
        return {
            cacheData: {},
            pictures: [],
            formVisible: false,
            isEdit: false,
            formData: {
                id: null,
                goodsId: '',
                imgDesc: '',
                imgPath: '',
                imgUrl: '',
                byOrder: 0
            },
            rules: {
                imgDesc: [
                    {
                        required: true,
                        message: '描述',
                        trigger: 'blur'
                    }
                ],
                imgUrl: [
                    {
                        required: true,
                        message: '请上传图片',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    mounted() {
        goodsPictures(this.$route.params.goodsId).then(data => {
            if (!data) {
                return
            }
            this.pictures = data
        })
    },
    methods: {
        cellStyle() {
            return 'padding: 5px 0px;'
        },
        /***********************Filter search************************* */
        handleFilter() {
            this.handleQueryList()
        },
        /***********************Remote query list************************* */
        handleQueryList() {
            goodsPictures(this.$route.params.goodsId)
                .then(response => {
                    this.pictures = response
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {})
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
                this.formData.id = uuid.v4().replace(/-/g, '')
                this.formData.goodsId = this.$route.params.goodsId
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
                goodsPicturesRemove(id).then(res => {
                    this.pictures = this.pictures.filter(v => v.id != id)
                })
            })
        },
        // 表单提交处理
        handleFormSave() {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    this.pictures.push(Object.assign({}, this.formData))
                    this.formVisible = false
                }
            })
        },
        updateImgUrl(value) {
            console.log('上传返回', value)
            this.formData.imgUrl = value.imgUrl
            this.formData.imgPath = value.objectKey
        },
        handleRemoteSave() {
            let data = {
                pictures: this.pictures,
                remark: '更新商品图片'
            }
            goodsUpdatePic(this.$route.params.goodsId, data)
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
                .finally(() => {})
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.custom-cell {
    padding: 2px 0px;
}
.action {
    margin-bottom: 10px;
}
</style>
