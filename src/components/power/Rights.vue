<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card> 
        <el-table :data= 'rigthsList' border stripe>
          <el-table-column label="#" type="index"></el-table-column>
            <el-table-column label='权限名称' prop='authName'></el-table-column>
            <el-table-column label='路径' prop='path'></el-table-column>
            <el-table-column label='权限等级' prop='level'></el-table-column>
        </el-table>
         </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rigthsList: [
        {
          id: 1012,
          authName: '商品管理',
          level: '0',
          pid: 0,
          path: 'goods',
        },
        {
          id: 102,
          authName: '订单管理',
          level: '0',
          pid: 0,
          path: 'orders',
        },
      ],
    }
  },
  created() {
    // this.getRightList()
  },
  methods: {
    async getRightList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('失败')
      }
      this.rigthsList = res.data
    },
  },
}
</script>
<style lang="less" scoped>
</style>