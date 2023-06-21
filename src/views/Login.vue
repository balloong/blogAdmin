<template>
  <div class="login-body">
    <div class="login-pannel">
      <div class="login-title">用户登录</div>
      <el-form :model="formData" ref="formDataRef" :rules="rules">
        <!-- 账号 -->
        <el-form-item prop="account">
          <el-input
            placeholder="请输入账号"
            v-model="formData.account"
            :prefix-icon="User"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            type="password"
            v-model="formData.password"
            :prefix-icon="Lock"
          ></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
              placeholder="请输入验证码"
              v-model="formData.checkCode"
              :prefix-icon="Key"
            ></el-input>
            <img
              :src="checkCodeUrl"
              class="check-code"
              @click="changeCheckCode"
            />
          </div>
        </el-form-item>
        <!-- 记住密码 -->
        <el-form-item>
          <el-checkbox v-model="formData.rememberMe" :true-label="1"
            >记住我</el-checkbox
          >
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button type="primary" :style="{ width: '100%' }" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script setup>
import { Lock, User, Key } from "@element-plus/icons-vue";
import VueCookies from "vue-cookies";
import md5 from "js-md5";
import { getCurrentInstance, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus'


const { proxy } = getCurrentInstance();
const router = useRouter();
const api = {
  checkCode: "api/checkCode",
  login: "/login",
};

const checkCodeUrl = ref(api.checkCode);
const changeCheckCode = () => {
  checkCodeUrl.value = api.checkCode + "?" + new Date().getTime();
};

//表单相关
const formDataRef = ref(null);
const formData = reactive({});

const rules = {
  account: [
    {
      required: true,
      message: "请输入用户名",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
    },
  ],
  checkCode: [
    {
      required: true,
      message: "请输入验证码",
    },
  ],
};

// 记住我
const init = () => {
  const loginInfo = VueCookies.get("loginInfo");
  if (!loginInfo) {
    return;
  }
  Object.assign(formData, loginInfo);
};
init();

// 登录的相关验证
const login = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let cookieLoginInfo = VueCookies.get("loginInfo");
    let cookiePassword = cookieLoginInfo == null ? null : cookieLoginInfo.password;

    if (formData.password !== cookiePassword) {
      formData.password = md5(formData.password);
    }

    let params = {
      account: formData.account,
      password: formData.password,
      checkCode: formData.checkCode,
    };

    let result = await proxy.Request({
      url: api.login,
      params: params,
      errorCallback: () => {
        changeCheckCode();
      },
    });
    if (!result) {
      return;
    }
    ElMessage.success("登录成功");

    setTimeout(() => {
      router.push("/");
    }, 1500);
    const loginInfo = {
      account: params.account,
      password: params.password,
      rememberMe: formData.rememberMe,
    };
    VueCookies.set("userInfo", result.data, 0);
    if (formData.rememberMe == 1) {
      VueCookies.set("loginInfo", loginInfo, "7d");
    }
  });
};
</script>


<style lang="scss" scoped>
.login-body {
  width: 100%;
  height: calc(100vh);
  // 图片大小跟随浏览器变化
  background-position: center;
  background: url(../assets/loginBackground.png), no-repeat;
  background-size: cover;
}

.login-pannel {
  width: 350px;
  position: relative;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border-radius: 5px;
  background-color: rgba($color: #fff, $alpha: 0.6);
}

.login-title {
  font-size: 25px;
  text-align: center;
  margin-bottom: 10px;
}

.check-code-panel {
  display: flex;
  align-items: center;
  .input-panel {
    flex: 1;
  }
  .check-code {
    height: 30px;
    cursor: pointer;
    margin-left: 5px;
  }
}
</style>
