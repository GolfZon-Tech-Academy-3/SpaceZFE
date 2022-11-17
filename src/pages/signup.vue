<template>
  <div class="wrapper">
    <div class="deco">
      <img class="signUpLogo" src="../assets/signUpLogo.png" />
    </div>
    <div class="signUp">
      <div style="height: 10%;">
        <h2>회원가입</h2>
      </div>
      <div class="signUpForm">
        <div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 1vh);">
            <span>
              이메일
            </span>
          </div>
        
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 4vh);">
            <input class="input" type="text" placeholder="이메일">
            <button class="button">인증번호 보내기</button>
          </div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 12vh);">
            <span>
              인증번호
            </span>
          </div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 15vh);">
            <input class="input" type="text" placeholder="인증번호 입력">
            <button class="button">확인</button>
          </div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 23vh);">
            <span>
              비밀번호
            </span>
          </div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 26vh);">
            <input class="input" type="password" placeholder="비밀번호 입력">
          </div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 33vh);">
            <input class="input" type="password" placeholder="비밀번호 재입력">
          </div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 40vh);">
            <span>
              닉네임
            </span>
          </div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 43vh);">
            <input class="input" type="text" placeholder="닉네임 입력">
            <button class="button">중복확인</button>
          </div>
          <div style="min-width: 400px;width: 40%;height: 3%;float:left; position: absolute;top: 20%;left: 75%;transform: translate(-50%, 50vh);">
            <button type="submit" class="submit">회원가입 하기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.wrapper {
  width : 100%;
  height : 95vh;
  
}
.deco {
  width: 50%;
  height: 100%;
  background-color: #041461;
  text-align: center;
  display : flex;
  justify-content: center;
  align-items : center;
  float: left;
}
@media (max-width: 1000px) {
  .deco {
    display: none;
  }
}
.signUpLogo {
  width: 50vh;
}
.signUp {
  width: 50%;
  height: 100%;
  background-color: transparent;
  float: left;
}
.signUpForm {
  height: 90%;
}
h2 {
  color:#041461;
  float: left;
  padding-left: 5%;
}
.title {
  height: 10%;
  display : flex;
  justify-content: center;
  align-items : center;
}
.button {
  padding: 3%;
  background-color: #041461;
  color: white;
  border: none;
  border-radius: 2em;
  margin-left: 3%;
  cursor: pointer;
}
.button:hover {
  background-color: skyblue;
}
.input {
  width: 60%;
  border: 1px solid white;
  border-bottom: 1px solid gray;
  padding: 3%;
}
.submit {
  width: 70%;
  padding: 3%;
  margin-top: 10%;
  background-color: #041461;
  color: white;
  border: none;
  border-radius: 2em;
  cursor: pointer;
}
.submit:hover {
  background-color: skyblue;
}
</style>