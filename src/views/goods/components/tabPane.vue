<template>
  <div>
    <goods-basic v-if="type=='goodsBasic'" />
    <goods-pictures v-if="type=='goodsPictures'" />
    <goods-record v-if="type=='goodsRecord'" />
  </div>
</template>

<script>
import GoodsBasic from './goodsBasic'
import GoodsRecord from './goodsRecord'
import GoodsPictures from './goodsPictures'

export default {
    props: {
        type: {
            type: String,
            default: 'goodsBasic'
        }
    },
    components: { GoodsBasic, GoodsPictures, GoodsRecord },
    data() {
        return {}
    },
    created() {},
    methods: {}
}
</script>

