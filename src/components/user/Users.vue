<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div>
        <el-row :gutter="20">
          <el-col :span="7"
            ><el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
              ></el-button> </el-input
          ></el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true"
              >添加用户</el-button
            >
          </el-col>
        </el-row>
        <el-table :data="userlist" border stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态">
            <template v-slot:default="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="userStatuChange(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template v-slot:default="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini" @click="removeUserById(scope.row.id)"
              ></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%"
    @close='editDialogClosed'>
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="email">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /\d+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法邮箱'))
    }
    var checkMobile = (rule, value, cb) => {
      const regMobile = /\w+/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法手机号'))
    }
    return {
      queryInfo: {
        query: '',
        //当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pageSize: 2,
      },
      userlist: [
        {
          id: 25,
          username: 'tige117',
          mobile: '18616358651',
          type: 1,
          email: 'tige112@163.com',
          create_time: '2017-11-09T20:36:26.000Z',
          mg_state: true, // 当前用户的状态
          role_name: '炒鸡管理员',
        },
      ],
      total: 1,
      addDialogVisible: false,
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      // 添加表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名3到10个之间', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '用户名6到15个之间', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 修改用户对话框
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    // this.getUserList()
  },
  methods: {
    async getUserList() {
      // const { data: res } = await this.$http.get('users', {
      //   params: this.queryInfo,
      // })
      // if (res.meta.status !== 200) return this.$message.error('获取失败')
      // this.userlist = res.data.userlist
      // this.total = res.data.total
    },
    // 监听pageSzie
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      // this.getUserList()
    },
    // 监听页码值改变
    handleCurrentChange() {
      this.queryInfo.pagenum = nwePage
      // this.getUserList()
    },
    // 监听switch开关状态
    async userStatuChange(userInfo) {
      console.log(userInfo)
      //  const {data : res} = await this.$http.put(`user/${userInfo.id}/state/${userInfo.mg_state}`)
      //  if(res.meta.status !== 200){
      //    userInfo.mg_state = !userInfo.mg_state
      //    return this.$message.error('修改失败')
      //  }
      //  this.$message.error('修改成功')
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser() {
      this.addDialogVisible = false
      // this.$refs.addFormRef.validator(async (valid) => {
      //   if (!valid) return
      //   //可以发起添加用户的网路请求
      //   const { data: res } = this.$http.port('users', addForm)
      //   if (res.meta.status !== 201) {
      //     this.$message.error('添加用户失败')
      //   }
      //   this.$message.success('添加成功')
      //   this.addDialogVisible = false
      //   this.getUserList()
      // })
    },
    // 展示编辑用户对话框
    async showEditDialog(id) {
      console.log(id)

      this.editDialogVisible = true
      return
      // const { data: res } = await this.$http.get('users/' + id)
      // if (res.meta.status !== 200) {
      //   return this.$message.error('失败')
      // }
      // this.editForm = res.data
      // this.editDialogVisible = true
    },
    editDialogClosed() {
      this.refs.addFormRef.resetFields()
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(
        valid => {
          if(!valid) return
          // 发起修改用户信息请求
          this.$http.put('/users/' + this.editForm.id,
            {email : this.editForm.email,
            mobile: this.editForm.mobile
            }
          )
          if(res.meta.status !== 200){
            return this.$message.error('失败')
          }
          this.editDialogVisible = false
          this.getUserList()
          this.$message.success('成功')
        }
      )
    },
    async removeUserById(id) {
      //弹框询问
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(
          err => err
        )
        if(confirmResult !== 'confirm') {
          return this.$message.info('已取消')
        }
        const {data: res} = await this.$http.delete('users/' +id)
        if(res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getUserList()

    }
  },
}
</script>

<style lang="less" scoped>
</style>