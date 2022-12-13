// eslint-disable-next-line
<template>
  <div class="modal-wrapper">
    <div class="modal-dialog">
      <div
        class="modal-content"
        style="background-color: rgba(255, 255, 255, 0)"
      >
        <div
          class="modal-body"
          style="background-color: rgba(255, 255, 255, 0)"
        >
          <span style="color: white" @click="onClose">&times;</span>
          <p
            v-if="edit.edit !== 'edit'"
            style="color: white; font-size: 1.5rem"
          >
            리뷰를 작성해주세요!
          </p>
          <p v-if="edit.edit == 'edit'" style="color: white; font-size: 1.5rem">
            리뷰를 수정해주세요!
          </p>
          <p class="inner">
            <span
              class="star"
              v-for="index in 5"
              :key="index"
              @click="check(index)"
            >
              <span
                style="color: yellow; font-size: 2.5rem"
                v-show="index < score"
                >★</span
              >
              <span
                style="color: white; font-size: 2.5rem"
                v-show="index >= score"
                >★</span
              >
            </span>
          </p>
        </div>
      </div>
      {{ editOrDel }}
      <div class="modal-content">
        <textarea
          v-model="revContent"
          name="reviewContent"
          id="text"
          cols="10"
          rows="10"
        ></textarea>
      </div>
      <div class="modal-content">
        <button v-if="edit.edit != 'edit'" class="btn" @click="submit">
          제출
        </button>
        <button v-if="edit.edit == 'edit'" class="btn" @click="put">
          수정
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const proxy = window.location.hostname === "localhost" ? "" : "/proxy";

export default {
  props: {
    writePack: {
      type: Object,
      required: true,
    },
    edit: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const score = ref(0);
    const revContent = ref("");
    const ids = ref(props.writePack);
    const edit = ref(props.edit);
    const router = useRouter();
    const store = useStore();

    console.log(edit.value);

    console.log(ids.value.companyId);
    console.log(ids.value.spaceId);

    const onClose = () => {
      emit("close");
    };

    const check = (index) => {
      score.value = index + 1;
      if (score.value == 2 && index == 1) {
        index = !index;
      }
    };

    //리뷰 쏘기
    const submit = async () => {
      if (revContent.value.length < 5) {
        alert("리뷰는 최소 5자 이상 써주세요!");
        revContent.value = "";
      } else {
        try {
          await axios
            .post(
              `${proxy}review/post`,
              {
                spaceId: ids.value.spaceId,
                companyId: ids.value.companyId,
                content: revContent.value,
                rating: score.value - 1,
              },
              {
                headers: {
                  Authorization: store.state.accessToken,
                },
              }
            )
            .then((res) => {
              if (res.status == 200) {
                alert("리뷰작성완료");
                onClose();
                router.go();
              }
            });
        } catch (error) {
          console.log(error);
          alert("예상치 못한 오류가 발생했습니다");
          router.go();
        }
      }
    };

    //리뷰수정put
    const put = async () => {
      if (revContent.value === "") {
        alert("리뷰를 수정하고 수정버튼을 눌러주세요!");
        revContent.value = "";
      } else {
        try {
          await axios
            .put(
              `${proxy}review/update`,
              {
                reviewId: edit.value.id,
                content: revContent.value,
                rating: score.value - 1,
              },
              {
                headers: {
                  Authorization: store.state.accessToken,
                },
              }
            )
            .then((res) => {
              if (res.status == 200) {
                alert("리뷰수정완료");
                onClose();
                router.go();
              }
            });
        } catch (error) {
          alert("예상치 못한 오류가 발생했습니다");
          onClose();
          router.go();
        }
      }
    };

    return {
      onClose,
      score,
      check,
      submit,
      revContent,
      ids,
      put,
    };
  },
};
</script>

<style scoped>
.modal-dialog {
  margin-top: 10%;
}
.modal-wrapper {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  height: fit-content;
  width: fit-content;
  text-align: center;
  border-radius: 15px;
  margin: 1%40%1%40%;
}
.btn {
  height: 10%;
  width: 20vw;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
}
#text {
  height: 30vh;
  width: 20vw;
  font-size: 1.5rem;
  border-radius: 15px;
}
.modal-body {
  width: 20vw;
}
.inner {
  margin-bottom: 0;
}
</style>
