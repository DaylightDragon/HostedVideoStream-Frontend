<template>
  <div class="player-page">
<!--    <h1>Stream Player</h1>-->
    <video ref="videoElement" class="video-player" controls></video>
<!--    <div v-if="error" class="error">{{ error }}</div>-->
  </div>
  <div class="dev-text" v-if="!prod_mode">Dev Mode</div>
  <div class="token-button-place">
    <button type="button" class="token-modal-show" @click.prevent="modalStore.openModal" >
      Токен
    </button>
  </div>
  <Modal :isOpen="modalStore.isOpen" @close="modalStore.closeModal" class="modal-token-done" >
    <div class="modal-token">
      <p class="modal-token-done-title">Введите токен доступа</p>
      <textarea class="token-input-field" aria-multiline="true" v-model="token_text" />
      <button type="button" @click.prevent="updateToken" >
        Сохранить
      </button>
    </div>
  </Modal>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Hls from 'hls.js';
import {Config} from "@/Config.ts";
import Modal from "@/components/Modal.vue";
import {useModalStore} from "@/stores/ModalStore.ts";
import {useAuthStore} from "@/stores/AuthStore.ts";

export default {
  name: 'StreamPlayer',
  components: {Modal},
  setup() {
    const videoElement = ref<HTMLVideoElement | null>(null);
    const error = ref<string | null>(null);
    const prod_mode = ref<boolean | null>(Config.PROD_MODE === "true");

    const modalStore = useModalStore();
    const authStore = useAuthStore();

    authStore.initializeStore();

    const token_text = ref<string | null>(null);

    console.log(Config.BACKEND_URL);
    const streamUrl = Config.BACKEND_URL + `/hls/test.m3u8` // ?token=${authStore.authData?.token}` // 'http://localhost:5900/hls/test.m3u8'; // URL HLS-потока // 'rtmp://127.0.0.1/live/test'

    const updateToken = () => {
      if (token_text.value) {
        authStore.set_token({"token": token_text.value});
      }
    };

    onMounted(() => {
      if(authStore.authData) token_text.value = authStore.authData?.token

      const video = videoElement.value;

      if (video) {
        if (Hls.isSupported()) {
          console.log("Token: " + authStore.authData?.token)

          const hls = new Hls({
            maxBufferLength: 20,
            maxMaxBufferLength: 40,
            liveSyncDuration: 0,
            // liveSyncDurationCount: 1,
            xhrSetup: function(xhr, url) {
              xhr.setRequestHeader('Authorization', `${authStore.authData?.token}`);
            }
          });

          hls.loadSource(streamUrl);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play();
          });

          hls.on(Hls.Events.FRAG_CHANGED, () => {
            const liveSync = hls.liveSyncPosition;
            if (liveSync !== null && video.currentTime < liveSync - 2) {
              video.currentTime = liveSync;
            }
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            error.value = `HLS error: ${data.type}`;
            console.log(data);

            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError();
                  break;
                default:
                  hls.destroy();
                  break;
              }
            }
          });

          setInterval(() => {
            const liveSync = hls.liveSyncPosition;
            if (liveSync !== null && video.currentTime < liveSync - 5) {
              video.currentTime = liveSync;
            }
          }, 5000);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
          video.addEventListener('loadedmetadata', () => {
            video.play();
          });
        } else {
          error.value = 'HLS is not supported in this browser.';
        }
      }
    });

    onUnmounted(() => {
      if (videoElement.value) {
        videoElement.value.pause();
        videoElement.value.removeAttribute('src');
      }
    });

    return {
      videoElement,
      error,
      prod_mode,
      modalStore,
      token_text,
      updateToken,
    };
  },
};
</script>

<style scoped>
:global(body) {
  background-color: #1f1f1f;
  color: white;
}

.error {
  color: #ff4f4f;
  margin-top: 10px;
}

.dev-text {
  position: absolute;
  top: 0;
  left: 0;
  margin: 4px;
  font-size: 1rem;
  font-weight: bold;
}

.token-button-place {
  position: absolute;
  top: 0;
  right: 0;
  margin: 4px;
  font-size: 1rem;
  font-weight: bold;
}

.player-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.video-player {
  width: 93%;
  height: 93%;
}

.modal-token {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.token-input-field {
  min-width: 70%;
  min-height: 30%;
}
</style>