import request from '@/utils/request'

// ----------------分类相关----------------
//分类列表
export function categoryList(query) {
    return request({
        url: '/api/category/list',
        method: 'post',
        params: query
    })
}

// 添加
export function categorySave(data) {
    return request({
        url: '/api/category/save',
        method: 'post',
        data
    })
}

export function categoryRemove(id) {
    return request({
        url: `/api/category/${id}/remove`,
        method: 'delete'
    })
}

//类别商品列表
export function getCategoryGoodsRel(categoryId) {
    return request({
        url: `/api/category/rel/${categoryId}`,
        method: 'get'
    })
}

// 添加关联商品
export function categoryGoodsSave(data) {
    return request({
        url: '/api/category/rel/save',
        method: 'post',
        data
    })
}

// ----------------商品相关----------------
//列表
export function goodsList(query) {
    return request({
        url: '/api/goods/list',
        method: 'post',
        params: query
    })
}

// 添加
export function goodsSave(data) {
    return request({
        url: '/api/goods/save',
        method: 'post',
        data
    })
}

export function goodsRemove(id) {
    return request({
        url: `/api/goods/${id}/remove`,
        method: 'delete'
    })
}

// 更新
export function goodsUpdate(goodsId, data) {
    return request({
        url: `/api/goods/${goodsId}/update`,
        method: 'put',
        data
    })
}

// 更新
export function goodsUpdatePic(goodsId, data) {
    return request({
        url: `/api/goods/${goodsId}/pic/update`,
        method: 'put',
        data
    })
}

export function goodsUpdateStatus(goodsId, data) {
    return request({
        url: `/api/goods/${goodsId}/update_status`,
        method: 'put',
        data
    })
}

// 详情
export function goodsDetail(goodsId) {
    return request({
        url: `/api/goods/detail/${goodsId}`,
        method: 'get'
    })
}

// 图片
export function goodsPictures(goodsId) {
    return request({
        url: `/api/goods/pictures/${goodsId}`,
        method: 'get'
    })
}

export function goodsPicturesRemove(id) {
    return request({
        url: `/api/goods/pictures/remove/${id}`,
        method: 'delete'
    })
}
// 详情
export function goodsRecords(goodsId) {
    return request({
        url: `/api/goods/records/${goodsId}`,
        method: 'get'
    })
}

// 
export function uploadImage(data) {
    return request({
      url: '/api/sys/attachments/upload',
      method: 'post',
      timeout:300000,
      data
    })
  }