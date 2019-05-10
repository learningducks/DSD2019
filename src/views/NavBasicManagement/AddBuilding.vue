<template>
  <el-form :model="addBuildingForm" ref="addBuildingForm" label-width="0px;">
    <el-form-item>
      <el-input v-model="addBuildingForm.buildingName"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="add">添加</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  methods: {
    add() {

    },
  },
};
</script>

<style>
</style>
