<template>
    <div>
        <form-dialog
            :visible.sync='menuVisible'
            :title="$t('views.system.components.menuSelect.message')"
            @onCancel="formClose"
            @onSubmit="handleFormSave"
        >
            <el-row>
                <el-tree
                    :data="menusData"
                    show-checkbox
                    :default-checked-keys="selected"
                    default-expand-all
                    node-key="id"
                    ref="tree"
                    highlight-current
                    :props="defaultProps"
                >
                </el-tree>
            </el-row>
        </form-dialog>
    </div>
</template>

<script>
import FormDialog from '@/components/FormDialog'
import { sysMenuTreeList } from '@/api/system'

export default {
    name: 'menuSelect',
    components: { FormDialog },
    props: {
        selected: {
            type: [Array]
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            menusData: [],
            defaultProps: {
                children: 'children',
                label: 'label',
                isLeaf: 'leaf',
                disabled: 'disabled'
            }
        }
    },
    computed: {
        menuVisible: {
            get() {
                return this.visible
            },
            set(val) {
                this.$emit('update:visible', val)
            }
        }
    },
    created() {},
    mounted() {
        sysMenuTreeList({ parentId: '' }).then(response => {
            this.menusData = response
        })
        this.$on('updateData', () => {
            sysMenuTreeList({ parentId: '' }).then(response => {
                this.menusData = response
            })
        })
    },
    methods: {
        // 关闭Form表单
        formClose(event) {
            this.$refs.tree.setCheckedKeys([])
            this.$emit('onCancel', event)
        },
        // 表单提交处理
        handleFormSave(event) {
            let checkedKeys = this.$refs.tree.getCheckedKeys()
            let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
            this.$emit('onSubmit', checkedKeys, halfCheckedKeys, event)
            this.$refs.tree.setCheckedKeys([])
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.d {
    height: 80%;
}
</style>
