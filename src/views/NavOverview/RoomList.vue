<template>
  <section>
    <!-- buildingFilter -->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form
        inline="true"
        :model="buildingFilter"
        ref="buildingFilter"
        label-width="80px"
      >
        <el-form-item label="教学楼：">
          <el-select
            v-model="buildingFilter.selectedIndex"
            multiple
            collapse-tags
            placeholder="请选择"
          >
            <el-option
              v-for="(building, index) in buildingList"
              :key="index"
              :label="building.buildingName"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            plain
            :disabled="this.buildingFilter.selectedIndex.length === 0"
            @click="query"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>

    <!-- roomlist -->
    <el-table
      :data="showRoomList"
      highlight-current-row
      height="650"
      v-loading="listLoading"
      style="width: 100%;"
      @selection-change="selChange"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column
        prop="buildingName"
        label="教学楼"
        width="150"
        sortable
      ></el-table-column>
      <el-table-column prop="roomID" label="房间" width="150"></el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        min-width="180"
      ></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="viewDetail(scope.$index, scope.row)">
            查看
          </el-button>
          <el-button
            type="danger"
            size="small"
            v-if="auth"
            @click="deleteRoom(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- toolbar -->
    <el-col :span="24" class="toolbar">
      <el-button
        type="danger"
        v-if="auth"
        :disabled="this.selectedRoomList.length === 0"
        @click="batchDelete"
      >
        批量删除
      </el-button>
      <el-pagination
        layout="prev, pager, next"
        style="float: right;"
        page-size="20"
        background
        :total="this.roomList.length"
        @current-change="changePage"
      >
      </el-pagination>
    </el-col>

    <!-- view detail -->
    <el-dialog
      title="查看"
      :visible.sync="showDetailDialog"
      :close-on-click-modal="false"
    >
      <el-table
        :data="hardwareList"
        highlight-current-row
        height="500"
        v-loading="dialogLoading"
        :row-class-name="hardwareState"
        style="width: 100%;"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column
          prop="hardwareID"
          label="硬件编号"
          width="150"
          sortable
        >
        </el-table-column>

        <el-table-column
          prop="type"
          label="类型"
          width="100"
          :formatter="typeFormatter"
          :filters="typeFilterList"
          :filter-method="filterType"
        >
        </el-table-column>
        <el-table-column
          prop="online"
          label="状态"
          min-width="80"
          :formatter="onlineFormatter"
          :filters="onlineFilterList"
          :filter-method="filterOnline"
        >
        </el-table-column>
        <el-table-column prop="updateTime" label="最后更新时间" min-width="80">
        </el-table-column>
        <el-table-column
          prop="data"
          label="描述"
          min-width="150"
          :formatter="dataFormatter"
        ></el-table-column>
        <el-table-column v-if="auth" label="操作" width="100">
          <template slot-scope="scope">
            <el-switch
              :disabled="scope.row.online === 0 || scope.row.type !== 'Light'"
              v-model="scope.row.data"
              active-value="True"
              inactive-value="False"
              active-text="开"
              inactive-text="关"
              @change="switchLight(scope.$index, scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getBuildingList, getRoomList, removeRoom } from '@/utils';

export default {
  data() {
    return {
      auth: true,
      buildingList: [],
      buildingFilter: {
        selectedIndex: [],
      },
      selectedRoomList: [],
      roomList: [],
      page: 1,
      listLoading: false,
      showDetailDialog: false,
      dialogLoading: false,
      detailBuildingID: 0,
      detailRoomID: 0,
      hardwareList: [
        {
          hardwareID: 1022,
          type: 'Light',
          data: 'True',
          online: 1,
        },
        {
          hardwareID: 1022,
          type: 'Light',
          data: 'True',
          online: 0,
        },
        {
          hardwareID: 1022,
          type: 'light',
          online: 1,
        },
        {
          hardwareID: 1022,
          type: 'motion',
          online: 1,
        },
        {
          hardwareID: 1022,
          type: 'button',
          online: 1,
        },
      ],

      typeFilterList: [
        { text: '光敏传感器', value: 'light' },
        { text: '运动传感器', value: 'motion' },
        { text: '灯', value: 'Light' },
        { text: '按钮', value: 'button' },
      ],
      onlineFilterList: [
        { text: '离线', value: 0 },
        { text: '在线', value: 1 },
      ],
    };
  },
  methods: {
    query() {
      this.roomList = [];
      this.listLoading = true;
      const params = { option: 'query', BID: '' };
      this.buildingFilter.selectedIndex.forEach((index) => {
        const buildingName = this.buildingList[index].buildingName;
        const buildingID = this.buildingList[index].buildingID;
        params.BID = buildingID;
        getRoomList(params).then((data) => {
          data.forEach((room) => {
            this.roomList.push({
              buildingName,
              buildingID,
              roomID: room.roomID,
            });
          });
        }).catch((err) => {
          this.roomList = [];
          this.listLoading = false;
          this.$message.error(err);
        });
      });
      this.listLoading = false;
    },
    deleteRoom(index, row) {
      this.$confirm('确认删除该房间吗？', '提示', {
        type: 'warning',
      }).then(() => {
        this.listLoading = true;
        const params = {
          buildingID: row.buildingID,
          roomID: row.roomID,
        };
        removeRoom(params).then((res) => {
          this.listLoading = false;
          this.$message({
            message: '删除成功',
            type: 'success',
          });
        });
      }).catch(() => {

      });
    },
    changePage(val) {
      this.page = val;
    },
    selChange(sel) {
      this.selectedRoomList = sel;
    },
    viewDetail(index, row) {
      // todo
      this.showDetailDialog = true;
    },
    batchDelete() {
      this.$alert('您点击了批量删除', '批量删除', {
        confirmButtonText: '确定',
        callback: (action) => {
          this.$message({
            type: 'info',
            message: `action: ${action}`,
          });
        },
      });
    },
    hardwareState({ row, rowIndex }) {
      return row.online ? 'success-row' : 'warning-row';
    },
    typeFormatter(row, column) {
      let type = '未知';
      this.typeFilterList.forEach(({ text, value }) => {
        if (value === row.type) type = text;
      });
      return type;
    },
    onlineFormatter(row, column) {
      let type = '未知';
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
    filterType(value, row) {
      return row.type === value;
    },
    filterOnline(value, row) {
      return row.online === value;
    },
    switchLight(index, row) {
      let info;
      if (row.data === 'True') { info = '确认打开该灯吗？'; } else { info = '确认关闭该灯吗？'; }
      this.$confirm(info, '提示', {
        type: 'warning',
      }).then(() => {

      }).catch(() => {
        if (this.hardwareList[index].data === 'True') {
          this.hardwareList[index].data = 'False';
        } else {
          this.hardwareList[index].data = 'True';
        }
      });
    },
  },
  computed: {
    showRoomList() {
      const l = (this.page - 1) * 20;
      const r = this.page * 20;
      return this.roomList.slice(l, r);
    },
  },
  created() {
    if (this.$store.getters.userinfo.role) {
      this.auth = ['admin', 'teacher'].indexOf(this.$store.getters.userinfo.role) >= 0;
    }
    const params = { option: 'query' };
    getBuildingList(params).then((data) => {
      console.log(data);
      this.buildingList = data;
    }).catch((err) => {
      this.$message.error(err);
    });
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/color.scss";
.danger-row {
  background: $color-danger;
}
.warning-row {
  background: $color-warning;
}
.success-row {
  background: $color-success;
}
</style>
