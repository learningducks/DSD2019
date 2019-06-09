<template>
  <section>
    <el-row :gutter="20">
      <el-col :span="24" style="padding-top: 10px;">
        <el-card>
          <div slot="header" style="overflow: hidden;">
            <strong style="font-size: 18px; float: left;">Raspi</strong>
          </div>
          <el-table
            :data="raspiList"
            v-loading="raspiTableLoading"
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
              prop="name"
              label="Name"
              min-width="50"
            ></el-table-column>
            <el-table-column
              prop="hardware"
              label="Hardware"
              min-width="50"
              sortable
            ></el-table-column>
            <el-table-column
              prop="online"
              label="Online"
              min-width="50"
              :formatter="onlineFormatter"
            ></el-table-column>
            <el-table-column label="Handle" min-width="50">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  size="medium"
                  @click="removeRaspi(scope.$index, scope.row)"
                  >Remove</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { requestRaspiList, updateRaspi } from '@/utils';

export default {
  data() {
    return {
      raspiList: [],
      raspiTableLoading: false,

      onlineFilterList: [
        { text: 'Offline', value: 0 },
        { text: 'Online', value: 1 },
      ],
    };
  },
  methods: {
    getRaspiList() {
      this.raspTableLoading = true;
      const params = { option: 0 };
      requestRaspiList(params).then((data) => {
        this.raspiList = data;
        this.uesrTableLoading = false;
      }).catch((err) => {
        this.raspiList = [];
        this.raspiTableLoading = false;
        this.$message.error(err);
      });
    },
    removeRaspi(index, row) {
      this.$confirm(`Remove ${row.name}?`, 'Confirm', {
        type: 'warning',
      }).then(() => {
        this.raspiTableLoading = true;
        const params = {
          option: 2,
          id: row.id,
        };
        updateRaspi(params).then((data) => {
          this.raspiList.splice(index, 1);
          this.raspiTableLoading = false;
          this.$message.success(`remove ${row.name} successfully`);
        }).catch((err) => {
          this.raspiTableLoading = false;
          this.$message.error(err);
        });
      }).catch(() => {

      });
    },
    onlineFormatter(row, column) {
      let type = 'Unknown';
      this.onlineFilterList.forEach(({ text, value }) => {
        if (value === row.online) type = text;
      });
      return type;
    },
  },
  mounted() {
    this.getRaspiList();
  },
};
</script>

<style>
</style>
