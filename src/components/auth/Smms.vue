<template>
  <el-container>
  <el-main>
    <el-row >
      <el-col :span="20" :offset="2">
        <div class="login">
          <el-row >
            <el-col :span="24">
              <div class="title">登入</div>
            </el-col>
          </el-row>

          <el-row class="rows">
            <el-col :span="18" :offset="3">
              <div class="username">
                 <el-input
                    placeholder="ID"
                    prefix-icon="el-icon-user"
                    v-model="username">
                  </el-input>
              </div>
            </el-col>
          </el-row>

          <el-row class="rows">
            <el-col :span="18" :offset="3">
              <div class="password">
                 <el-input
                    placeholder="password"
                    prefix-icon="el-icon-lock"
                    v-model="password"
                    show-password>
                  </el-input>
              </div>
            </el-col>
          </el-row>


           <el-row class="rows">
            <el-col :span="18" :offset="3">
              <div class="remember">
                  <el-checkbox v-model="checked">记住我</el-checkbox>
              </div>
            </el-col>
          </el-row>


           <el-row style="margin-bottom:10px">
            <el-col :span="18" :offset="3">
              <div class="sign">
                
                  <el-button type="primary" size="medium" @click.stop="sign">登入</el-button>
              </div>
            </el-col>
          </el-row>
          
           <el-row>
            <el-col :span="2" :offset="3">
              <div>
                  <router-link  to="/m3nu">
                    <el-link type="primary">菜单</el-link>
                  </router-link>
              </div>
            </el-col>
          </el-row>

           <el-row style="margin-top:30px">
            <el-col :span="2" :offset="21">
              <div >
                  <el-link type="warning">试用</el-link>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </el-main>
</el-container>
</template>


<script>
import HttpApi from '../../util/http.js'
const qs = require('querystring')
export default {
  name: 'Smms',
  data(){
    return {
      username:'ch3ng',
      password: "ch3ng4smms",
      rememberMe: false,
    }
  },
  methods:{
    sign(){
      let params = new URLSearchParams();
      params.append("username","abc");
      params.append("password",this.password);

      // let data = qs.stringify(quarm);
      // console.log(data);
      HttpApi.post(
        '/api/v2/token',
        params,
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .then(response=>{
        if(response.success){
          this.$store.commit("setToken",response.data.token);
        }else{
          throw response.message;
        }
      }).catch(err => {
        let myNotification = new Notification('失败',{
                body: err,
                silent: true,
            });
      });
    }
  },
  created(){
    this.$store.commit("setUri","https://sm.ms");
    HttpApi.defaults.baseURL = "https://sm.ms";
  }
}
</script>

<style scoped>

.login{
   /* background-color: #ccc; */
   height: 400px;
   margin-top: 50px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}

.title{
  text-align: center;
  color: #409eff;
  margin:20px 0 30px 0 ;
}
.rows{
  margin-bottom: 30px;
}

.sign .el-button{
  width: 100%;
}
</style>