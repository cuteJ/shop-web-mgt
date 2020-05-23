<template>
    <div>
        <el-cascader
            v-if="lazy"
            :style="inputStyle"
            v-model="currentSelected"
            :options="selectedOptions"
            :placeholder="placeholder"
            filterable
            clearable
            @change="handleChange"
            @active-item-change="handleItemChange"
        ></el-cascader>
        <el-cascader
            v-else
            :style="inputStyle"
            v-model="currentSelected"
            :options="selectedOptions"
            filterable
            clearable
            collapse-tags
            :placeholder="placeholder"
            :props="props"
            @change="handleChange"
        ></el-cascader>
    </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import { regionByPid, regionByDepth, regionAll } from '@/api/system'

export default {
    name: 'CascaderArea',
    props: {
        placeholder: {
            type: String,
            default: '请选择'
        },
        props: {
            type: Object
        },
        lazy: {
            type: Boolean,
            default: true
        },
        selected: {
            type: Array
        },
        inputStyle: {
            type: String,
            default: 'width: 100%;'
        }
    },
    directives: { waves },
    data() {
        return {
            selectedOptions: []
        }
    },
    computed: {
        currentSelected: {
            get() {
                return this.selected
            },
            set(val) {
                this.$emit('update:selected', val)
            }
        }
    },
    mounted() {
        if (this.lazy) {
            regionByDepth(1).then(data => {
                this.selectedOptions = data
            })
        } else {
            regionAll().then(data => {
                this.selectedOptions = data
            })
        }
    },
    methods: {
        handleChange(val) {
          this.$emit('change', val)
        },
        handleItemChange(val) {
            console.log(val)
            let parentId = val[0]
            if (!parentId) {
                return
            }
            if (val.length > 1) {
                parentId = val[1]
            }
            regionByPid(parentId).then(data => {
                for (let i = 0; i < this.selectedOptions.length; i++) {
                    let s = this.selectedOptions[i]
                    if (s.value === val[0]) {
                        if (s.children && s.children.length > 0) {
                            for (let j = 0; j < s.children.length; j++) {
                                let c = s.children[j]
                                if (c.value === val[1]) {
                                    c.children = data
                                }
                            }
                        } else {
                            s.children = data
                        }
                    }
                }
            })
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
