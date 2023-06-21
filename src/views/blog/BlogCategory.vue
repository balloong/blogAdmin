<template>
<!-- 博客类别的组件 -->
  <div>
    <!-- 新增分类按键 -->
    <el-button
      type="danger"
      @click="showEdit('add')"
      v-if="userInfo.roleType == 1"
    >
      新增分类
    </el-button>
    <!-- 
      博客分类的表格的栏目（columns）  包括：
          1、封面图片
          2、名称
          3、简介
          4、博客数
          5、操作（修改、删除、上移、下移）
    -->
    <Table
      :columns="columns"
      :showPagination="false"
      :dataSource="tableData"
      :fetch="loadDataList"
      :option="tableOptions"
    >
      <!--封面栏 插入图片组件 -->
      <!-- 
        row:当前行的元素
        index：当前行的索引
       -->
      <template #cover="{ index, row }">
        <Cover :cover="row.cover"></Cover>
      </template>

      <!-- 操作栏 -->
      <template #op="{ index, row }" v-if="userInfo.roleType == 1">
        <div class="op">
          <!-- 修改 -->
          <a
            href="javascript:void(0)"
            class="a-link"
            @click="showEdit('update', row)"
            >修改</a
          >
          <!-- el-divider竖线间隔 -->
          <el-divider direction="vertical" />
          <!-- 删除 -->
          <a href="javascript:void(0)" class="a-link" @click="del(row)">删除</a>
          <el-divider direction="vertical" />
          <!-- 上移 -->
          <a
            href="javascript:void(0)"
            :class="[index == 0 ? 'not-allow' : 'a-link']"
            @click="changeSort(index, 'up')"
            >上移</a
          >
          <el-divider direction="vertical" />
          <!-- 下移 -->
          <a
            href="javascript:void(0)"
            :class="[
              index == tableData.list.length - 1 ? 'not-allow' : 'a-link',
            ]"
            @click="changeSort(index, 'down')"
            >下移</a
          >
        </div>
      </template>
    </Table>

    <!-- 弹窗 -->
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="500px"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
      >
        <el-form-item label="名称" prop="categoryName">
          <el-input placeholder="请输入名称" v-model="formData.categoryName">
          </el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <CoverUpload v-model="formData.cover"></CoverUpload>
        </el-form-item>
        <el-form-item label="简介" prop="categoryDesc">
          <el-input
            v-model="formData.categoryDesc"
            type="textarea"
            placeholder="请输入简介"
            :autosize="{ minRows: 4, maxRows: 4 }"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";

const { proxy } = getCurrentInstance();

const api = {
  loadDataList: "/category/loadAllCategory4Blog",
  saveCategory: "/category/saveCategory4Blog",
  delCategory: "category/delCategory4Blog",
  changeSort: "category/changeCategorySort4Blog",
};

// 从cookies里取数据
const userInfo = ref(proxy.VueCookies.get("userInfo") || {});

const columns = [
  {
    label: "封面",
    prop: "cover",
    width: 100,
    scopedSlots: "cover",
  },
  {
    label: "名称",
    prop: "categoryName",
    width: 200,
  },
  {
    label: "简介",
    prop: "categoryDesc",
  },
  {
    label: "博客数量",
    prop: "blogCount",
    width: 100,
  },
  {
    label: "操作",
    prop: "op",
    width: 200,
    scopedSlots: "op",
  },
];

// 数据源对象
const tableData = reactive({});
// 表格的相关选项
const tableOptions = {
  extHeight: 10,
};
// 获取数据源
const loadDataList = async () => {
  let result = await proxy.Request({
    // 接口
    url: api.loadDataList,
  });
  if (!result) {
    return;
  }
  tableData.list = result.data;
};

// 弹窗
// 新增、修改
const dialogConfig = reactive({
  // 是否展示（弹出）
  show: false,
  // 标题
  title: "标题",
  // 底部按键
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});
const formData = ref({});
const rules = {
  categoryName: [{ required: true, message: "请输入分类名称" }],
};
const formDataRef = ref();

const showEdit = (type, data) => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    if (type == "add") {
      dialogConfig.title = "新增分类";
      formData.value = {};
    } else if (type == "update") {
      dialogConfig.title = "编辑分类";
      formData.value = JSON.parse(JSON.stringify(data));
    }
  });
};
// 保存博客列表的信息
const submitForm = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    let params = {};
    Object.assign(params, formData.value);
    let result = await proxy.Request({
      url: api.saveCategory,
      params,
    });
    if (!result) return;
    dialogConfig.show = false;
    proxy.Message.success("保存成功");
    loadDataList();
  });
};

// 删除
const del = (data) => {
  proxy.Confirm(`你确定要删除${data.categoryName}`, async () => {
    let result = await proxy.Request({
      url: api.delCategory,
      params: {
        categoryId: data.categoryId,
      },
    });
    if (!result) return;
    loadDataList();
  });
};

// 修改排序
const changeSort = async (index, type) => {
  let categoryList = tableData.list;
  // 在最上或者最下面一行时，不能在上移或者下移
  if (
    (type === "down" && index === categoryList.length - 1) ||
    (type === "up" && index === 0)
  )
    return;
  // 两个中间变量
  let temp = categoryList[index];
  let number = type == "down" ? 1 : -1;
  // 删除索引所在行
  categoryList.splice(index, 1);
  // 将索引所在行的数据添加到上一行
  categoryList.splice(index + number, 0, temp);

  let result = await proxy.Request({
    url: api.changeSort,
    dataType: "json",
    params: categoryList,
  });
  if (!result) return;
  proxy.Message.success("重新排序成功");
  loadDataList();
};
</script>

<style lang="scss" scoped>
</style>
