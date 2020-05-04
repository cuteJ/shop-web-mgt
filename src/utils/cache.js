'use strict'
import Vue from 'vue'
import { getCacheCodes , selectOptions, selectsOptions} from '@/api/system'

export function cacheData(cacheData, typeCodes) {
    return new Promise((resolve, reject) => {
        getCacheCodes({ typeCodes: typeCodes }).then(data => {
            Vue.set(cacheData, 'codes', data)
            let statusMap = {}
            let all = {}
            for (let key in data) {
                let dataArr = data[key]['__default__']
                let obj = {}
                for (let i in dataArr) {
                    let key = dataArr[i].valCode
                    obj[key] = dataArr[i].valName
                    all[key] = dataArr[i].valName
                }
                statusMap[key] = obj
            }
            statusMap['__default__'] = all
            Vue.set(cacheData, 'statusMap', statusMap)
            resolve(1)
        })
    })
}

export function cacheSelectOptionsData(cacheData, selectTypes, query) {
    return new Promise((resolve, reject) => {
        selectsOptions(selectTypes, query).then(data => {
            let statusMap = {}
            for(let key in data){
                let obj = {}
                for(let i=0;i<data[key].length;i++){
                    obj[data[key][i].value] = data[key][i].label
                }
                statusMap[key] = obj
            }
            Vue.set(cacheData, 'options', statusMap)
            resolve(1)
        })
    })
}

export function getCacheData(typeCodes, then) {
    getCacheCodes({ typeCodes: typeCodes }).then(data => {
        let cacheData = {}
        cacheData.codes = data
        let statusMap = {}
        let all = {}
        for (let key in data) {
            let dataArr = data[key]['__default__']
            let obj = {}
            for (let i in dataArr) {
                let key = dataArr[i].valCode
                obj[key] = dataArr[i].valName
                all[key] = dataArr[i].valName
            }
            statusMap[key] = obj
        }
        statusMap['__default__'] = all
        cacheData.statusMap = statusMap
        then(cacheData)
    })
}
