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

export default {
    name: 'FormDialog',
    props: {
        visible: {
            type: Boolean,
            default: false
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
            fullscreen: false,
            screenWidth: ''
        }
    },
    watch: {
        screenWidth(val) {
            if (val < 768) {
                this.fullscreen = true
            } else {
                this.fullscreen = false
            }
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
        const that = this
        if (document.body.clientWidth < 768) {
            this.fullscreen = true
        }
        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientWidth
                that.screenWidth = window.screenWidth
            })()
        }
    },
    methods: {
        handleCancel(event) {
            this.$emit('onCancel', event)
        },
        handleSubmit(event) {
            this.$emit('onSubmit', event)
        }
    }
}
</script>
<style>
@media screen and (max-width: 768px) {
      .el-dialog--small {
        width: 380px !important;
    }
}

@media screen and (min-width: 990px) {
      .el-dialog--small {
         width: 700px !important;
    }
}
</style>
