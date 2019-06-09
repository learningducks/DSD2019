<template>
  <section>
    <el-row :gutter="20">
      <el-col :span="10" style="padding-top: 10px;">
        <el-card>
          <div slot="header" style="overflow: hidden;">
            <strong style="font-size: 18px; float: left;">Building</strong>
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              size="medium"
              round
              style="float: right;"
              v-if="buildPermission"
              @click="showBuildingDialog"
              >Add</el-button
            >
          </div>
          <el-table
            :data="buildingList"
            v-loading="buildingTableLoading"
            style="width: 100%;"
            height="300"
            stripe
          >
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column
              prop="id"
              label="ID"
              min-width="50"
              sortable
            ></el-table-column>
            <el-table-column
              prop="name"
              label="Name"
              min-width="50"
            ></el-table-column>
            <el-table-column label="Handle" min-width="75">
              <template slot-scope="scope">
                <el-button size="medium" @click="getRoomList(scope.row)"
                  >Select</el-button
                >
                <el-button
                  type="danger"
                  size="medium"
                  v-if="buildPermission"
                  @click="removeBuilding(scope.$index, scope.row)"
                  >Remove</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="14" style="padding-top: 10px;">
        <el-card>
          <div slot="header" style="overflow: hidden;">
            <strong style="font-size: 18px; float: left;">Room</strong>
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              size="medium"
              round
              style="float: right;"
              :disabled="selectedBuildingID < 0"
              v-if="buildPermission"
              @click="showRoomDialog(null)"
              >Add</el-button
            >
          </div>
          <el-table
            :data="roomList"
            v-loading="roomTableLoading"
            style="width: 100%;"
            height="300"
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
              prop="name"
              label="Name"
              min-width="50"
            ></el-table-column>
            <el-table-column
              prop="defaultValue"
              label="Default Value"
              min-width="50"
            ></el-table-column>
            <el-table-column
              prop="timeout"
              label="Timeout"
              min-width="50"
            ></el-table-column>
            <el-table-column label="Handle" min-width="100">
              <template slot-scope="scope">
                <el-button size="medium" @click="getHardwareList(scope.row)"
                  >Select</el-button
                >
                <el-button
                  size="medium"
                  type="primary"
                  v-if="buildPermission"
                  @click="showRoomDialog(scope.row)"
                  >Edit</el-button
                >
                <el-button
                  size="medium"
                  type="danger"
                  v-if="buildPermission"
                  @click="removeRoom(scope.$index, scope.row)"
                  >Remove</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="24" style="padding-top: 20px;">
        <el-card>
          <div slot="header" style="overflow: hidden;">
            <strong style="font-size: 18px; float: left;">Hardware</strong>
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              size="medium"
              round
              style="float: right;"
              :disabled="selectedRoomID < 0"
              v-if="buildPermission"
              @click="showHardwareDialog(null)"
              >Add</el-button
            >
          </div>
          <el-table
            :data="hardwareList"
            v-loading="hardwareTableLoading"
            style="width: 100%;"
            height="600"
            stripe
          >
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column
              prop="id"
              label="ID"
              min-width="50"
              sortable
            ></el-table-column>
            <el-table-column
              prop="name"
              label="Name"
              min-width="50"
            ></el-table-column>
            <el-table-column
              prop="type"
              label="Type"
              min-width="50"
            ></el-table-column>
            <el-table-column
              prop="host"
              label="Host"
              min-width="50"
            ></el-table-column>
            <el-table-column
              prop="gpio"
              label="GPIO"
              min-width="50"
            ></el-table-column>
            <el-table-column
              prop="online"
              label="Online"
              min-width="50"
              :formatter="onlineFormatter"
            ></el-table-column>
            <el-table-column
              prop="value"
              label="Value"
              min-width="50"
            ></el-table-column>
            <el-table-column label="Handle" min-width="100">
              <template slot-scope="scope">
                <el-button
                  size="medium"
                  type="danger"
                  v-if="buildPermission"
                  @click="removeHardware(scope.$index, scope.row)"
                  >Remove</el-button
                >
                <el-button
                  size="medium"
                  type="primary"
                  v-if="
                    scope.row.type_id === 1 &&
                      (buildPermission || forcePermission)
                  "
                  @click="switchLight(scope.$index, scope.row)"
                  >Switch</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="Add Building"
      :visible.sync="buildingDialog.show"
      :close-on-click-modal="false"
    >
      <el-form
        :model="buildingDialog.data"
        :rules="buildingRules"
        ref="buildingForm"
        label-width="150px"
        status-icon
      >
        <el-form-item label="Name:" prop="name">
          <el-input
            v-model="buildingDialog.data.name"
            @keyup.enter.native="addBuilding"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="buildingDialog.show = false">Cancel</el-button>
        <el-button type="primary" @click="addBuilding">Add</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="roomDialog.title"
      :visible.sync="roomDialog.show"
      :close-on-click-modal="false"
    >
      <el-form
        :model="roomDialog.data"
        :rules="roomRules"
        ref="roomForm"
        label-width="150px"
        status-icon
      >
        <el-form-item label="Name:" prop="name">
          <el-input v-model="roomDialog.data.name"></el-input>
        </el-form-item>
        <el-form-item label="Default Value:" prop="defaultValue">
          <el-input
            placeholder="0"
            v-model.number="roomDialog.data.defaultValue"
          ></el-input>
        </el-form-item>
        <el-form-item label="Timeout:" prop="timeout">
          <el-input
            placeholder="600"
            v-model.number="roomDialog.data.timeout"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roomDialog.show = false">Cancel</el-button>
        <el-button type="primary" @click="aeRoom">
          {{ roomDialog.button }}
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="hardwareDialog.title"
      :visible.sync="hardwareDialog.show"
      :close-on-click-modal="false"
    >
      <el-form
        :model="hardwareDialog.data"
        :rules="hardwareRules"
        ref="hardwareForm"
        label-width="150px"
        status-icon
      >
        <el-form-item label="Name:" prop="name">
          <el-input v-model="hardwareDialog.data.name"></el-input>
        </el-form-item>
        <el-form-item label="Type:" prop="type">
          <el-select
            v-model="hardwareDialog.data.type"
            placeholder="please select"
          >
            <el-option
              v-for="item in hardwareTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Host:" prop="host">
          <el-input v-model.number="hardwareDialog.data.host"></el-input>
        </el-form-item>
        <el-form-item label="GPIO:" prop="gpio">
          <el-input v-model="hardwareDialog.data.gpio"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hardwareDialog.show = false">Cancel</el-button>
        <el-button type="primary" @click="aeHardware">
          {{ hardwareDialog.button }}
        </el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { requestBuildingList, updateBuilding, requestRoomList, updateRoom, requestHardwareList, controlHardware } from '@/utils';

export default {
  data() {
    return {
      buildingList: [],
      buildingTableLoading: false,
      buildingDialog: {
        show: false,
        data: {
          option: 1,
          name: '',
        },
      },
      buildingRules: {
        name: [
          { required: true, message: 'please input building name', trigger: 'blur' },
        ],
      },

      selectedBuildingID: -1,
      roomList: [],
      roomTableLoading: false,
      roomDialog: {
        data: {
          option: 1,
          name: '',
          defaultValue: 0,
          timeout: 600,
        },
        show: false,
        title: 'Add Room',
        button: 'Add',
      },
      roomRules: {
        name: [
          { required: true, message: 'please input room name', trigger: 'blur' },
        ],
        defaultValue: [
          { required: true, message: 'please input default value', trigger: 'blur' },
          { type: 'number', message: 'default value should be 0 or 1' },
        ],
        timeout: [
          { required: true, message: 'please input timeout', trigger: 'blur' },
          { type: 'number', message: 'timeout should be numeric' },
        ],
      },

      selectedRoomID: -1,
      hardwareList: [],
      hardwareTableLoading: false,
      hardwareDialog: {
        data: {
          option: 1,
        },
        show: false,
        title: 'Add Hardware',
        button: 'Add',
      },
      hardwareTypeList: [
        {
          value: 1,
          label: 'Light',
        },
        {
          value: 2,
          label: 'Alarm',
        },
        {
          value: 3,
          label: 'Light Sensor',
        },
        {
          value: 4,
          label: 'Presence Sensor',
        },
        {
          value: 5,
          label: 'Button',
        },
        {
          value: 6,
          label: 'Panic Button',
        },
      ],

      detailBuildingID: 0,
      detailRoomID: 0,
      typeFilterList: [
        { text: '光敏传感器', value: 'light' },
        { text: '运动传感器', value: 'motion' },
        { text: '灯', value: 'Light' },
        { text: '按钮', value: 'button' },
      ],
      onlineFilterList: [
        { text: 'Offline', value: 0 },
        { text: 'Online', value: 1 },
      ],
    };
  },
  methods: {
    showBuildingDialog() {
      this.buildingDialog.data.option = 1;
      this.buildingDialog.data.name = '';
      this.buildingDialog.show = true;
    },
    getBuildingList() {
      this.buildingTableLoading = true;
      const params = { option: 0 };
      requestBuildingList(params).then((data) => {
        this.buildingList = data;
        this.buildingTableLoading = false;
      }).catch((err) => {
        this.buildingList = [];
        this.buildingTableLoading = false;
        this.$message.error(err);
      });
    },
    addBuilding() {
      this.$refs.buildingForm.validate((valid) => {
        if (valid) {
          const params = this.buildingDialog.data;
          updateBuilding(params).then((data) => {
            this.buildingDialog.show = false;
            this.$message.success('add building successfully');
            this.getBuildingList();
          }).catch((err) => {
            this.$message.error(err);
          });
        }
      });
    },
    removeBuilding(index, row) {
      this.$confirm(`Remove ${row.name}?`, 'Confirm', {
        type: 'warning',
      }).then(() => {
        this.buildingTableLoading = true;
        const params = {
          option: 2,
          id: row.id,
        };
        updateBuilding(params).then((data) => {
          this.buildingList.splice(index, 1);
          this.buildingTableLoading = false;
          this.$message.success(`remove ${row.name} successfully`);
        }).catch((err) => {
          this.buildingTableLoading = false;
          this.$message.error(err);
        });
      }).catch(() => {

      });
    },

    showRoomDialog(data) {
      if (data === null) {
        this.roomDialog = {
          data: {
            option: 1,
            building: this.selectedBuildingID,
            name: '',
            defaultValue: 0,
            timeout: 600,
          },
          show: true,
          title: 'Add Room',
          button: 'Add',
        };
      } else {
        this.roomDialog = {
          data: {
            option: 3,
            building: this.selectedBuildingID,
            ...data,
          },
          show: true,
          title: 'Edit Room',
          button: 'Edit',
        };
      }
    },
    getRoomList(row) {
      this.roomTableLoading = true;
      const params = {
        option: 0,
        building: row.id,
      };
      requestRoomList(params).then((data) => {
        this.selectedBuildingID = row.id;
        this.roomList = data;
        this.roomTableLoading = false;
      }).catch((err) => {
        this.roomList = [];
        this.roomTableLoading = false;
        this.$message.error(err);
      });
    },
    aeRoom() {
      this.$refs.roomForm.validate((valid) => {
        if (valid) {
          const params = this.roomDialog.data;
          updateRoom(params).then((data) => {
            this.roomDialog.show = false;
            this.$message.success(`${params.option === 1 ? 'add' : 'edit'} room successfully`);
            this.getRoomList({ id: this.selectedBuildingID });
          }).catch((err) => {
            this.$message.error(err);
          });
        }
      });
    },
    removeRoom(index, row) {
      this.$confirm(`Remove ${row.name}?`, 'Confirm', {
        type: 'warning',
      }).then(() => {
        this.roomTableLoading = true;
        const params = {
          option: 2,
          id: row.id,
        };
        updateRoom(params).then((data) => {
          this.roomList.splice(index, 1);
          this.roomTableLoading = false;
          this.$message.success(`remove ${row.name} successfully`);
        }).catch((err) => {
          this.roomTableLoading = false;
          this.$message.error(err);
        });
      }).catch(() => {

      });
    },

    showHardwareDialog(data) {
      if (data === null) {
        this.hardwareDialog = {
          data: {
            option: 1,
            name: '',
            type: '',
            host: 0,
          },
          show: true,
          title: 'Add Hardware',
          button: 'Edit',
        };
      } else {
        this.hardwareDialog = {
          data: {
            option: 3,
            ...data,
          },
          show: true,
          title: 'Edit Hardware',
          button: 'Edit',
        };
      }
    },
    getHardwareList(row) {
      this.hardwareTableLoading = true;
      const params = {
        option: 0,
        room: row.id,
      };
      requestHardwareList(params).then((data) => {
        this.selectedRoomID = row.id;
        this.hardwareList = data;
        this.hardwareTableLoading = false;
      }).catch((err) => {
        this.hardwareList = [];
        this.hardwareTableLoading = false;
        this.$message.error(err);
      });
    },
    removeHardware(index, row) {

    },

    typeFormatter(row, column) {
      let type = '未知';
      this.typeFilterList.forEach(({ text, value }) => {
        if (value === row.type) type = text;
      });
      return type;
    },
    onlineFormatter(row, column) {
      let type = 'Unknown';
      this.onlineFilterList.forEach(({ text, value }) => {
        if (value === row.online) type = text;
      });
      return type;
    },
    dataFormatter(row, column) {
      switch (row.type) {
        case 'Light': return row.data === 'True' ? '开' : '关';
        case 'light': return row.data === 'bright' ? '室内光线充足' : '室内光线不足';
        case 'motion': return row.data === 'Exist' ? '有人' : '无人';
        case 'button': return row.data === 'Pressed' ? '按下' : '未按下';
        default: return '无';
      }
    },
    timeFormatter(row, column) {
      if (row.updateTime !== 0) {
        const d = new Date(row.updateTime);
        const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        return date;
      }
      return '无';
    },
    filterType(value, row) {
      return row.type === value;
    },
    filterOnline(value, row) {
      return row.online === value;
    },
    switchLight(index, row) {
      const info = `${row.value === 1 ? 'Close' : 'Open'} ${row.name}?`;
      this.$confirm(info, '提示', {
        type: 'warning',
      }).then(() => {
        const params = {
          command: {
            hardware: row.id,
            value: 1 - row.value,
            type: 0,
          },
        };
        controlHardware(params).then((data) => {
          this.getHardwareList({ id: this.selectedRoomID });
          this.$message.success(`switch ${row.name} successfully`);
        }).catch((err) => {
          this.$message.error(err);
        });
      }).catch(() => {

      });
    },
  },
  computed: {
    buildPermission() {
      return this.$store.getters.userinfo.permission.indexOf('build') >= 0;
    },
    forcePermission() {
      return this.$store.getters.userinfo.permission.indexOf('force') >= 0;
    },
  },
  mounted() {
    this.getBuildingList();
  },
};
</script>

<style>
</style>
