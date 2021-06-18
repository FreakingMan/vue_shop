<template>
  <el-container class="home-container">
    <!-- 页面头部 -->
    <el-header>
      <div>
        <img src="../assets/aaa.jpg" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="tooggleColapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="subNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-star-off"></i>
                <span>{{ subItem.authName }}</span>
              </template></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: [
        {
          id: 101,
          authName: '权限管理',
          path: null,
          pid: 0,
          children: [
            {
              id: 105,
              authName: '角色列表',
              path: 'powers',
              pid: 101,
              children: [
                {
                  id: 105,
                  authName: '添加商品',
                  path: null,
                  pid: '104,101',
                },
              ],
            },
            {
              id: 106,
              authName: '权限列表',
              path: 'rights',
              pid: 101,
              children: [
                {
                  id: 105,
                  authName: '添加商品',
                  path: null,
                  pid: '104,101',
                },
              ],
            },
          ],
        },
        {
          id: 101,
          authName: '商品管理',
          path: null,
          pid: 0,
          children: [
            {
              id: 104,
              authName: '商品列表',
              path: 'users',
              pid: 101,
              children: [
                {
                  id: 105,
                  authName: '添加商品',
                  path: null,
                  pid: '104,101',
                },
              ],
            },
          ],
        },
      ],
      iconsObj: {
        101: 'iconfont icon-computer',
      },
      isCollapse: false,
      activePath: '',
    }
  },
  created() {
    this.getMenuList(),
      (this.activePath = window.sessionStorage.getItem('activePath'))
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$messaget.error(res.meta.msg)
      this.menuList = res.data
    },
    tooggleColapse() {
      this.isCollapse = !this.isCollapse
    },
    subNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
  },
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  // padding: 0;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
img {
  height: 60px;
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaeaea;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>