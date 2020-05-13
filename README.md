# 管理系统
该项目为【管理系统】前端部分

分支说明

**1.x.x** 该分支提供基础模版  
**2.x.x** 计划添加业务功能（如：订单，商品等） 

后端项目地址：[shop-server](https://github.com/cuteJ/shop-server)

## 项目介绍
`shop-web-mgt`是【管理系统】前端项目，基于Vue+Element实现。
 
 **项目说明**
 
   该项目致力于为开发者提供一套快速系统搭建模版，（包含：系统用户，菜单，权限，调度任务，常量，数据字典等功能）
 以便开发人员专注于业务功能开发。
 
 --------
 * 应用管理
     * 应用列表
 * 系统管理
    * 用户管理
    * 角色管理
    * 菜单管理
    * 定时任务
    * 数据字典
    * 接口列表
    * 接口权限
    * 常量管理
    * 地区管理

### 项目演示
 <a href="http://shop-web-mgt.onlythinking.com" target="_blank">**在线地址**</a>

### 项目结构

```
src -- 源码目录
├── api -- API
├── assets -- 图片资源文件
├── components -- 通用组件
├── directive -- vue指令
├── filters -- 过滤器
├── lang -- 国际化配置
├── icons -- svg文件
├── router -- 路由配置
├── store -- vuex状态管理
├── styles -- 全局css样式
├── utils -- 工具类
└── views -- 页面组件
    ├── app -- 应用管理（小程序）
    ├── dashboard -- 首页
    ├── errorPage -- 错误页面
    ├── layout -- 布局页面
    ├── login -- 登录页
    ├── profile -- 个人配置
    ├── svg-icons -- 图标
    ├── system -- 系统管理
        ├── components -- 页面级别组件
        ├── sysApiListManager -- 接口列表
        ├── sysAuthorityManager -- 接口权限
        ├── sysDicManager -- 常量管理
        ├── sysJobManager -- 定时任务
        ├── sysJobRunLogManager -- 定时任务日志
        ├── sysMenuManager -- 菜单管理
        ├── sysMetadataManager -- 数据字典
        ├── sysOptLogManager -- 操作日志
        ├── sysRegionManager -- 地区管理
        ├── sysRoleManager -- 角色管理
        ├── sysUserManager -- 系统用户管理
    ├── user -- C端用户管理
        ├── userLoginManager -- C端用户列表
```

## 快速开始

```bash
# Clone the project
git clone https://github.com/cuteJ/shop-web-mgt.git

# install dependency
npm install --registry=https://registry.npm.taobao.org

# develop
npm run dev
```

#### 打包构建
```bash
# build for test environment
npm run build:sit

# build for production environment
npm run build:prod
```

#### 创建页面
1. 在以下文件添加页面组件

```
src 
├── store
    ├── constants.js

```

2. 添加菜单数据

![添加菜单](https://github.com/cuteJ/shop-web-mgt/blob/master/images/add_menu.png)

## 开发计划
 * 1.x 计划版本(1.0.0) 待测试
 * 2.x 待开发 

## 技术参考

 * <a href="https://cn.vuejs.org" target="_blank">**Vuejs**</a>
 * <a href="https://element.eleme.cn/#/zh-CN" target="_blank">**Element-ui**</a>
 * <a href="https://github.com/axios/axios" target="_blank">**Axios**</a>
 * <a href="https://animate.style" target="_blank">**Animate**</a>
 * <a href="https://lodash.com" target="_blank">**Lodash**</a>
 * <a href="http://necolas.github.io/normalize.css" target="_blank">**Normalize**</a>

## 致谢
 * [**vue-element-admin**](https://github.com/PanJiaChen/vue-element-admin)
 
## 许可证

[MIT License](https://github.com/cuteJ/shop-web-mgt/blob/master/LICENSE)

Copyright © 2020 icutej.com. All rights reserved.

