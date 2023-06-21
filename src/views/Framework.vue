<template>
  <div class="layout">
    <el-container>
      <!-- 头部 -->
      <el-header class="header">
        <div class="logo">Blog后台管理系统</div>
        <div class="user-info">
          <span>欢迎回来</span>
          <el-dropdown trigger="click">
            <span class="nick-name">
              {{ userInfo.nickName }}
              <span class="iconfont icon-close"></span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goUserInfo">
                  个人信息
                </el-dropdown-item>
                <el-dropdown-item @click="logout"> 退出 </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div class="avatar">
            <img :src="userInfo.avatar" />
          </div>
        </div>
      </el-header>

      <el-container class="container">
        <!-- 左侧导航栏 -->
        <el-aside width="200px" class="left-aside">
          <el-button class="post-btn"
          @click="createHTML">发布</el-button>
          <!-- 导航栏菜单 -->
          <div class="menu-panel">
            <ul>
              <!-- 一级菜单 -->
              <li v-for="(menu, index) in menuList">
                <span class="menu-title-p" @click="openClose(index)">
                  <span :class="['iconfont', menu.icon]"></span>
                  <span class="menu-title">{{ menu.title }}</span>
                  <span
                    :class="[
                      'iconfont',
                      'open-close',
                      menu.open ? 'icon-open' : 'icon-close',
                    ]"
                  ></span>
                </span>
                <!-- 二级菜单 -->
                <ul v-show="menu.open" class="sub-menu">
                  <li v-for="subMenu in menu.children">
                    <!-- 跳转到指定页面 -->
                    <router-link
                      :to="subMenu.path"
                      :class="[
                        'sub-menu-item',
                        activePath == subMenu.path ? 'active' : '',
                      ]"
                      >{{ subMenu.title }}</router-link
                    >
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </el-aside>
        <!-- 右侧主体显示区域 -->
        <el-main class="right-main">
          <!-- 指定页面的展示区域 -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, watch, getCurrentInstance } from "vue";
import VueCookies from "vue-cookies";
import { ArrowDown } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();

const menuList = ref([
  {
    title: "博客",
    icon: "icon-blog",
    open: true,
    children: [
      {
        title: "博客管理",
        path: "/blog/list",
      },
      {
        title: "分类管理",
        path: "/blog/category",
      },
    ],
  },
  {
    title: "专题",
    icon: "icon-zhuanti",
    open: true,
    children: [
      {
        title: "专题管理",
        path: "/special/list",
      },
    ],
  },
  {
    title: "设置",
    icon: "icon-settings",
    open: true,
    children: [
      {
        title: "个人信息设置",
        path: "/settings/my",
      },
      {
        title: "博客成员",
        path: "/settings/user",
      },
      {
        title: "系统设置",
        path: "/settings/sysInfo",
        roleType: 1,
      },
    ],
  },
  {
    title: "回收站",
    icon: "icon-delete",
    open: true,
    children: [
      {
        title: "回收站",
        path: "/recovery/list",
      },
    ],
  },
]);

const api = {
  getUserInfo: "getUserInfo",
  logout: "logout",
  createHtml: "createHtml",
  checkProgress: "checkProgress",
};

// 菜单栏打开or关闭二级菜单
const openClose = (index) => {
  const open = menuList.value[index].open;
  menuList.value[index].open = !open;
};

const userInfo = reactive({});

const getUserInfo = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo,
  });
};

// 监听store
watch(() => store.state.userInfo, (newVal, oldVal) => {
  const avatar = proxy.globalInfo.imageUrl + newVal.avatar;
  const nickName = newVal.nickName;
  userInfo.value = { avatar, nickName };
}, { immediate: true, deep: true });


// 用户信息初始化
const init = () => {
  userInfo.value = VueCookies.get("userInfo");
};
init();

const activePath = ref(null);
watch(
  route,
  (newVal, oldVal) => {
    activePath.value = newVal.path;
  },
  { immediate: true, deep: true } //深层遍历
);

// 发布按钮


</script>

<style lang="scss" scoped>
.layout {
  .header {
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo {
      font-size: 30px;
      color: green;
    }
    .user-info {
      display: flex;
      align-items: center;
      .nick-name {
        cursor: pointer;
        color: rgb(6, 143, 234);
        .icon-close {
          font-size: 14px;
        }
      }
    }
  }
  .container {
    padding-top: 10px;
    background-color: #f5f6f7;
    height: calc(100vh - 60px);
    .right-main {
      background-color: #fff;
    }
    // 导航栏
    .left-aside {
      padding: 0 15px;
      padding-top: 10px;
      width: 250px;
      .post-btn {
        color: #fff;
        background-color: blueviolet;
        height: 40px;
        width: 100%;
      }
      .menu-panel,
      ul,
      li {
        padding: 0;
        margin: 0;
        list-style: none;
      }
      // 左侧导航栏一级标题样式
      .menu-title-p {
        line-height: 45px;
        font-size: 18px;
        cursor: pointer;
        display: flex;
        .iconfont {
          font-style: 18px;
          color: #91949a;
        }
        .menu-title {
          flex: 1;
          color: #3f4042;
          margin-left: 15px;
        }
        .open-close {
          width: 20px;
        }
      }
      .menu-title-p:hover {
        background-color: #fff;
      }

      .sub-menu {
        padding-left: 30px;
        font-size: 14px;
        .sub-menu-item {
          padding: 0 10px 0 33px;
          display: block;
          cursor: pointer;
          line-height: 30px;
          text-decoration: none;
          color: #3f4042;
        }
        .active {
          background: #fff;
        }
        .sub-menu-item:hover {
          background-color: #fff;
        }
      }
    }
  }
}
</style>
