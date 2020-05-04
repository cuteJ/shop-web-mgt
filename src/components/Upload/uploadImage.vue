<template>
    <div class="upload-container">
        <el-upload
            :multiple="false"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            class="image-uploader"
            drag
            action
            :http-request="handleUpload"
        >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div class="image-preview">
            <div
                v-show="imageUrl"
                class="image-preview-wrapper"
            >
                <img :src="imageUrl+'?imageView2/1/w/200/h/200'">
                <div class="image-preview-action">
                    <i
                        class="el-icon-delete"
                        @click="rmImage"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { uploadImage } from '@/api/goods'

export default {
    name: 'uploadImage',
    props: {
        value: {
            type: String,
            default: ''
        },
        domain: {
            type: String,
            default: ''
        },
        businessNo: {
            type: String,
            default: ''
        },
        businessType: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            tempUrl: '',
            fileObj: {}
        }
    },
    computed: {
        imageUrl() {
            return this.value
        }
    },
    methods: {
        rmImage() {
            this.emitInput({ imgUrl: '', objectKey: null })
        },
        emitInput(val) {
            this.$emit('input', val)
        },
        handleImageSuccess() {
            this.emitInput(this.fileObj)
        },
        beforeUpload() {
            const _self = this
            return new Promise((resolve, reject) => {
                resolve(true)
            })
        },
        handleUpload(item) {
            const fileObj = item.file
            // FormData 对象
            const form = new FormData()
            form.append('file', fileObj)
            form.append('domain', this.domain)
            form.append('businessNo', this.businessNo)
            form.append('businessType', this.businessType)
            uploadImage(form).then(response => {
                console.log(response)
                this.$message.success('上传成功')
                this.tempUrl = response.url
                this.fileObj = {
                    imgUrl: response.url,
                    objectKey: response.objectKey
                }
                this.handleImageSuccess()
            })
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.upload-container {
    width: 100%;
    position: relative;
    @include clearfix;
    .image-uploader {
        width: 60%;
        float: left;
    }
    .image-preview {
        width: 200px;
        height: 200px;
        position: relative;
        border: 1px dashed #d9d9d9;
        float: left;
        margin-left: 50px;
        .image-preview-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .image-preview-action {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            cursor: default;
            text-align: center;
            color: #fff;
            opacity: 0;
            font-size: 20px;
            background-color: rgba(0, 0, 0, 0.5);
            transition: opacity 0.3s;
            cursor: pointer;
            text-align: center;
            line-height: 200px;
            .el-icon-delete {
                font-size: 36px;
            }
        }
        &:hover {
            .image-preview-action {
                opacity: 1;
            }
        }
    }
}
</style>
