<template>
    <div>
        <el-input
            :readonly="!isEdit"
            :style="inputStyle"
            :size="size"
            v-model="currentQuantity"
            @focus="handleFocus"
            @blur="handleBlur"
            autocomplete="off"
        >
            <template slot="prepend">
                <el-button
                    :size="size"
                    @click="handleSubtract"
                >-</el-button>
            </template>
            <template slot="append">
                <el-button
                    :size="size"
                    @click="handleAdd"
                >+</el-button>
            </template>
        </el-input>
    </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive

export default {
    name: 'AddSubtractor',
    props: {
        size: {
            type: String,
            default: 'small'
        },
        isEdit: {
            type: Boolean,
            default: true
        },
        inputStyle: {
            type: String,
            default: 'width:128px;text-align: center'
        },
        quantity: {
            type: Number
        }
    },
    directives: { waves },
    data() {
        return {
            beforeValue: 0
        }
    },
    computed: {
        currentQuantity: {
            get() {
                return this.quantity
            },
            set(val) {
                this.$emit('update:quantity', val)
            }
        }
    },
    mounted() {},
    methods: {
        handleFocus(event) {
            this.beforeValue = this.currentQuantity
            this.$emit('focus', event)
        },
        handleBlur(event) {
            if (this.currentQuantity === this.beforeValue) {
                return
            }
            if (!/^\+?[1-9][0-9]*$ /.test(this.currentQuantity)) {
                this.$message({
                    type: 'warning',
                    message: '请输入正确的数字'
                })
                this.currentQuantity = this.beforeValue
                return
            }
            this.currentQuantity = parseInt(this.currentQuantity)
            this.$emit('blur', event)
        },
        handleSubtract() {
            if (this.currentQuantity <= 1) {
                this.$message({
                    type: 'warning',
                    message: '不能再少了！'
                })
                return
            }
            this.currentQuantity = this.currentQuantity - 1
        },
        handleAdd() {
            this.currentQuantity = this.currentQuantity + 1
        }
    }
}
</script>

<style>
.el-select {
    width: 110px;
}

.input-with-select {
    width: 400px;
}
.input-with-select .el-input-group__prepend {
    background-color: #fff;
}
</style>
