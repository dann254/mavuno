<template>
  <div class="home">
    <div class="row">
      <div class="col panel login-panel">
        <h1 class="display-3 company-name">mavuno</h1>
        <div class="login-form">
          <div class="h3">Login</div>
          <div class="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" class="form-control is-invalid" id="exampleInputEmail1" v-model="form.email" aria-describedby="emailHelp" placeholder="Enter email">
            <div class="invalid-feedback">
              Please choose a username.
            </div>
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1"  v-model="form.password" placeholder="Password">
          </div>
          <button class="btn btn-primary" @click="submit">Login</button>
        </div>
      </div>
      <div class="col panel image-panel"></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'


export default {
  name: 'Home',
  components: {
  },
  data () {
    return {
      form: {
        email: 'admin@example.com',
        password: 'password1'
      },
      error : false
    }
  },
  methods: {
    ...mapActions({
      signIn: 'auth/signIn'
    }),
    submit () {
      this.signIn(this.form)
        .then(success => {
          this.$router.push({name: 'Farmers'})
          console.log(success)
        })
        .catch(error => {
          this.error = true;
          console.log(error)
        })
    },
    redirect() {
      localStorage.setItem('loggedIn', true)
      this.$router.push({name: 'Farmers'})
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100vh;
  width: 100vw;

  .row {
    height: 100vh;
    width: 100vw;
    margin: 0;

    .panel {
      height: 100vh;
      width: 50vw;
      margin: 0;

      .company-name {
        font-weight: 400;
      }

      &.login-panel {
        padding: 80px;
        display: flex;
        flex-direction: column;

        .login-form {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }

      &.image-panel {
        background-image: url('../assets/crops.jpg');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
    }
  }
}
</style>
