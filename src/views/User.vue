<template>
  <section>
    <el-row :gutter="20">
      <el-col :span="18" style="padding-top: 10px;">
        <el-card>
          <div slot="header" style="overflow: hidden;">
            <strong style="font-size: 18px; float: left;">User</strong>
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              size="medium"
              round
              style="float: right;"
              @click="showUserDialog(null)"
              >Add</el-button
            >
          </div>
          <el-table
            :data="userList"
            v-loading="userTableLoading"
            style="width: 100%;"
            height="675"
            stripe
          >
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column
              prop="id"
              label="ID"
              min-width="25"
              sortable
            ></el-table-column>
            <el-table-column
              prop="user"
              label="Username"
              min-width="50"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="Name"
              min-width="50"
            ></el-table-column>
            <el-table-column
              prop="role"
              label="Role"
              min-width="50"
            ></el-table-column>
            <el-table-column
              prop="permission_str"
              label="Permission"
              min-width="100"
              :formatter="arrayToString"
            ></el-table-column>
            <el-table-column label="Handle" min-width="75">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="medium"
                  @click="showUserDialog(scope.row)"
                  >Edit</el-button
                >
                <el-button
                  type="danger"
                  size="medium"
                  @click="removeUser(scope.$index, scope.row)"
                  >Remove</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="6" style="padding-top: 10px;">
        <el-card>
          <div slot="header" style="overflow: hidden;">
            <strong style="font-size: 18px; float: left;">Role</strong>
            <el-button
              type="primary"
              icon="el-icon-circle-check"
              size="medium"
              round
              style="float: right;"
              @click="updateRolePriority"
              >Apply</el-button
            >
          </div>
          <el-card v-for="role in roleList" :key="role.id" shadow="never">
            <div slot="header" style="overflow: hidden;">
              <strong style="font-size: 16px; float: left;">
                {{ role.name }}
              </strong>
            </div>
            <el-form
              :model="role"
              :rules="roleRules"
              ref="roleForm"
              label-width="100px"
              status-icon
            >
              <el-form-item label="Priority:" prop="priority">
                <el-input v-model="role.priority"></el-input>
              </el-form-item>
              <el-form-item label="Permission:" prop="permission">
                <el-input disabled v-model="role.renderString"></el-input>
              </el-form-item>
            </el-form>
          </el-card>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      :title="userDialog.title"
      :visible.sync="userDialog.show"
      :close-on-click-modal="false"
    >
      <el-form
        :model="userDialog.data"
        :rules="userRules"
        ref="userForm"
        label-width="150px"
        status-icon
      >
        <el-form-item label="ID:" prop="id" v-if="userDialog.data.option === 3">
          <el-input v-model.number="userDialog.data.id"></el-input>
        </el-form-item>
        <el-form-item label="Name:" prop="name">
          <el-input v-model="userDialog.data.name"></el-input>
        </el-form-item>
        <el-form-item
          label="Username:"
          prop="user"
          v-if="userDialog.data.option === 1"
        >
          <el-input v-model="userDialog.data.user"></el-input>
        </el-form-item>
        <el-form-item
          label="Password:"
          prop="password"
          v-if="userDialog.data.option === 1"
        >
          <el-input v-model="userDialog.data.password"></el-input>
        </el-form-item>
        <el-form-item
          label="Permission"
          prop="permission"
          v-if="userDialog.data.option === 3"
        >
          <!-- <el-checkbox-group v-model="userDialog.data.permission">
            <el-checkbox
              v-for="item in userPermissionList"
              :label="item.value"
              :key="item.value"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group> -->
          <el-input v-model="userDialog.data.permission"></el-input>
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="userDialog.data.role">
            <el-option
              v-for="item in userRoleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDialog.show = false">Cancel</el-button>
        <el-button type="primary" @click="aeUser">
          {{ userDialog.button }}
        </el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import md5 from 'js-md5';
import { requestUserList, updateUser, requestRoleList, updateRole } from '@/utils';

export default {
  data() {
    return {
      userList: [],
      uesrTableLoading: false,
      userDialog: {
        data: {
          option: 1,
          name: '',
          user: '',
          password: '',
          role: '',
        },
        show: false,
        title: 'Add User',
        button: 'Add',
      },
      userRoleList: [
        {
          value: 1,
          label: 'Administrator',
        },
        {
          value: 2,
          label: 'Teacher',
        },
        {
          value: 3,
          label: 'Student',
        },
      ],
      userPermissionList: [
        {
          value: 'admin',
          label: 'Administrator',
        },
        {
          value: 'build',
          label: 'Management',
        },
        {
          value: 'force',
          label: 'Lighting',
        },
      ],

      roleList: [],
    };
  },
  methods: {
    getUserList() {
      this.uesrTableLoading = true;
      const params = { option: 0 };
      requestUserList(params).then((data) => {
        this.userList = data;
        this.uesrTableLoading = false;
      }).catch((err) => {
        this.userList = [];
        this.uesrTableLoading = false;
        this.$message.error(err);
      });
    },
    showUserDialog(data) {
      if (data === null) {
        this.userDialog = {
          data: {
            option: 1,
            name: '',
            user: '',
            password: '',
            role: '',
          },
          show: true,
          title: 'Add User',
          button: 'Add',
        };
      } else {
        this.userDialog = {
          data: {
            option: 3,
            ...data,
          },
          show: true,
          title: 'Edit User',
          button: 'Edit',
        };
        this.userRoleList.forEach((role) => {
          if (this.userDialog.data.role === role.label) {
            this.userDialog.data.role = role.value;
          }
        });
      }
    },
    aeUser() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.userDialog.data));
          if (params.password) params.password = md5(`${params.user}#${params.password}`);
          updateUser(params).then((data) => {
            this.userDialog.show = false;
            this.$message.success(`${params.option === 1 ? 'add' : 'edit'} user successfully`);
            this.getUserList();
          }).catch((err) => {
            this.$message.error(err);
          });
        }
      });
    },
    removeUser(index, row) {
      this.$confirm(`Remove ${row.name}?`, 'Confirm', {
        type: 'warning',
      }).then(() => {
        this.userTableLoading = true;
        const params = {
          option: 2,
          id: row.id,
        };
        updateUser(params).then((data) => {
          this.userList.splice(index, 1);
          this.userTableLoading = false;
          this.$message.success(`remove ${row.name} successfully`);
        }).catch((err) => {
          this.userTableLoading = false;
          this.$message.error(err);
        });
      }).catch(() => {

      });
    },

    getRoleList() {
      const params = { option: 0 };
      requestRoleList(params).then((data) => {
        this.roleList = data;
        this.roleList.forEach((role) => {
          role.renderString = this.arrayToString(role, {});
        });
      }).catch((err) => {
        this.roleList = [];
        this.$message.error(err);
      });
    },
    updateRolePriority() {
      let success = true;
      let message = 'edit role\'s priority successfully';
      this.roleList.forEach((role) => {
        ((role) => {
          const params = {
            option: 3,
            id: role.id,
            priority: role.priority,
          };
          updateRole(params).then((data) => {

          }).catch((error) => {
            success = false;
            message = error;
          });
        })(role);
      });
      this.getRoleList();
      if (success) {
        this.$message.success(message);
      } else {
        this.$message.error(message);
      }
    },

    arrayToString(row, column) {
      const render = (permission) => {
        let str = 'Unknown';
        this.userPermissionList.forEach((option) => {
          if (permission === option.value) str = option.label;
        });
        return str;
      };
      // eslint-disable-next-line camelcase
      const permission_str = [];
      row.permission_str.forEach((permission) => {
        permission_str.push(render(permission));
      });
      if (permission_str.length === 0) return 'None';
      return `${permission_str.join(' | ')}`;
    },
  },
  mounted() {
    this.getUserList();
    this.getRoleList();
  },
};
</script>

<style>
</style>
