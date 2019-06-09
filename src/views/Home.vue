<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="10" class="logo" style="width: 200px;">
        <el-tooltip
          content="Intelligent Light Control System"
          placement="bottom"
          effect="dark"
        >
          <span style="text-align: center; display: block;">{{ sysName }}</span>
        </el-tooltip>
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner">
            <img src="@/assets/defaultAvatar.jpg" /> {{ nickname }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item disabled> {{ role }} </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout"
              >Sign out</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside>
        <el-menu :default-active="$route.path" router>
          <template v-for="item in $router.options.routes">
            <template v-for="route in item.children" v-if="!route.hidden">
              <el-menu-item :index="route.path" :key="route.path">
                <i :class="route.icon"></i>{{ route.name }}
              </el-menu-item>
            </template>
          </template>
        </el-menu>
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
          <el-col :span="24" style="box-sizing: border-box;">
            <transition name="fade" mode="out-in">
              <router-view />
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import { requestLogList } from '@/utils';

export default {
  data() {
    return {
      sysName: 'ILCS',
      nickname: '',
      role: '',

      logList: [],
    };
  },
  methods: {
    logout() {
      const This = this;
      this.$confirm('Opt-out?', 'Confirm', {}).then(() => {
        This.$store.commit('clear');
        This.$router.push({ path: '/login' });
        This.$message.success('logout successfully');
      }).catch(() => {

      });
    },

    getLogList() {
      const params = { option: 0 };
      requestLogList(params).then((data) => {
        this.logList = data;
        this.logList.forEach((log) => {
          this.$notify.warning({
            title: 'Warning',
            message: 'TestLog',
            duration: 0,
          });
        });
      }).catch((err) => {
        this.logList = [];
        this.$message.error(err);
      });
    },
  },
  mounted() {
    this.nickname = this.$store.getters.userinfo.nickname;
    this.role = this.$store.getters.userinfo.role;
    this.getLogList();
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
        color: $color-text-primary;
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
      font-size: 20px;
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
      flex: 0 0 200px;
      width: 200px;
      .el-menu {
        height: 100%;
      }
    }
    .content-container {
      flex: 1;
      overflow-y: scroll;
      padding: 20px;
      .breadcrumb-container {
        .title {
          font-size: 20px;
          width: 200px;
          float: left;
          color: $color-primary;
        }
        .breadcrumb-inner {
          float: right;
        }
      }
    }
  }
}
</style>
