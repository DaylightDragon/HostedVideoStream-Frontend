<template>
  <div class="player-page">
<!--    <h1>Stream Player</h1>-->
    <video ref="videoElement" class="video-player" controls></video>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Hls from 'hls.js';

export default {
  name: 'StreamPlayer',
  setup() {
    const videoElement = ref<HTMLVideoElement | null>(null);
    const error = ref<string | null>(null);

    const streamUrl = 'http://localhost:5900/hls/test.m3u8'; // URL HLS-потока // 'rtmp://127.0.0.1/live/test'

    onMounted(() => {
      const video = videoElement.value;

      if (video) {
        if (Hls.isSupported()) {
          const hls = new Hls({
            maxBufferLength: 30,
            maxMaxBufferLength: 60,
            liveSyncDuration: 0,
            // liveSyncDurationCount: 3,
          });

          hls.loadSource(streamUrl);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play();
          });

          hls.on(Hls.Events.FRAG_CHANGED, () => {
            const liveSync = hls.liveSyncPosition;
            if (liveSync !== null && video.currentTime < liveSync - 5) {
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
    };
  },
};
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
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
</style>