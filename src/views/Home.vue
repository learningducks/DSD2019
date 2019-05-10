<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col
        :span="10"
        class="logo"
        :class="collapsed ? 'logo-collapse-width' : 'logo-width'"
      >
        {{ collapsed ? "" : sysName }}
      </el-col>
      <el-col :span="10">
        <div class="tools" @click.prevent="collapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner">
            <img src="@/assets/defaultAvatar.jpg" /> {{ nickname }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item disabled> {{ role }} </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout"
              >退出</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside :class="collapsed ? 'menu-collapsed' : 'menu-expanded'">
        <el-menu
          :default-active="$route.path"
          unique-opened
          router
          v-show="!collapsed"
        >
          <template
            v-for="(item, index) in $router.options.routes"
            v-if="!item.hidden"
          >
            <el-submenu :index="index" :key="index">
              <template slot="title">
                <i :class="item.icon"></i>{{ item.name }}
              </template>
              <el-menu-item
                v-for="child in item.children"
                :index="child.path"
                :key="child.path"
                v-if="!child.hidden"
              >
                {{ child.name }}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
        <ul
          class="el-menu el-menu-vertical-demo collapsed"
          v-show="collapsed"
          ref="menuCollapsed"
        >
          <li
            v-for="(item, index) in $router.options.routes"
            :key="index"
            v-if="!item.hidden"
            class="el-submenu item"
          >
            <template>
              <div
                class="el-submenu__title"
                style="padding-left: 20px;"
                @mouseover="showMenu(index, true)"
                @mouseout="showMenu(index, false)"
              >
                <i :class="item.icon"></i>
              </div>
              <ul
                class="el-menu submenu"
                :class="'submenu-hook-' + index"
                @mouseover="showMenu(index, true)"
                @mouseout="showMenu(index, false)"
              >
                <li
                  v-for="child in item.children"
                  v-if="!child.hidden"
                  :key="child.path"
                  class="el-menu-item"
                  style="padding-left: 40px;"
                  :class="$route.path == child.path ? 'is-active' : ''"
                  @click="$router.push(child.path)"
                >
                  {{ child.name }}
                </li>
              </ul>
            </template>
          </li>
        </ul>
      </aside>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col ::span="24" class="breadcrumb-container">
            <strong class="title">{{ $route.name }}</strong>
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item
                v-for="item in $route.matched"
                :key="item.path"
              >
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      sysName: '智能光控系统',
      nickname: '',
      role: '',
      collapsed: false,
    };
  },
  methods: {
    logout() {
      const This = this;
      this.$confirm('确认退出吗?', '提示', {}).then(() => {
        This.$store.commit('clear');
        This.$router.push({ path: '/login' });
        This.$message.success('退出成功');
      }).catch(() => {

      });
    },
    collapse() {
      // this.collapsed = !this.collapsed;
    },
    showMenu(i, status) {
      this.$refs.menuCollapsed.getElementsByClassName(`submenu-hook-${i}`)[0].style.display = status ? 'block' : 'none';
    },
  },
  mounted() {
    this.nickname = this.$store.getters.userinfo.nickname;
    const roleName = {
      admin: '管理员',
      teacher: '教师',
      student: '学生',
    };
    this.role = roleName[this.$store.getters.userinfo.role];
  },
};
</script>


<style lang="scss" scoped>
@import "@/styles/color.scss";
.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  .header {
    height: 60px;
    line-height: 60px;
    background: $color-primary;
    color: whitesmoke;
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .userinfo-inner {
        cursor: pointer;
        color: whitesmoke;
        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin: 10px 0px 10px 10px;
          float: right;
        }
      }
    }
    .logo {
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
      border-color: rgba(238, 241, 146, 0.3);
      border-right-width: 1px;
      border-right-style: solid;
      img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
      }
      .txt {
        color: whitesmoke;
      }
    }
    .logo-width {
      width: 230px;
    }
    .logo-collapse-width {
      width: 60px;
    }
    .tools {
      padding: 0px 23px;
      width: 14px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
    }
  }
  .main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    aside {
      flex: 0 0 230px;
      width: 230px;
      .el-menu {
        height: 100%;
      }
      .collapsed {
        width: 60px;
        .item {
          position: relative;
        }
        .submenu {
          position: absolute;
          top: 0px;
          left: 60px;
          z-index: 99999;
          height: auto;
          display: none;
        }
      }
    }
    .menu-collapsed {
      flex: 0 0 60px;
      width: 60px;
    }
    .menu-expanded {
      flex: 0 0 230px;
      width: 230px;
    }
    .content-container {
      flex: 1;
      overflow-y: scroll;
      padding: 20px;
      .breadcrumb-container {
        .title {
          width: 200px;
          float: left;
          color: #475669;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
      .content-wrapper {
        background-color: whitesmoke;
        box-sizing: border-box;
      }
    }
  }
}
</style>
