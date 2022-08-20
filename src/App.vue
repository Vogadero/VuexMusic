<template>
  <!-- 这里用于定义Vue组件的模板内容 -->
  <div class="wrap" id="app">
    <!-- 背景特效 -->
    <canvas id="canvas"></canvas>
    <!-- 开关灯 -->
    <div id="lampadario">
        <input type="radio" name="switch" value="on" class="switching-light"/>
        <input type="radio" name="switch" value="off" checked="checked" class="switching-light"/>
        <label for="switch"></label>
        <div id="filo"></div>
    </div>
    <div class="play_wrap" id="player">
        <div class="search_bar">
          <img src="./assets/images/player_title.png" alt="" />
          <!-- 搜索歌曲 -->
          <input
            type="text"
            autocomplete="off"
            :value="keywords"
            @change="monitorInputValChange"
            @keyup.enter="searchAll"
            title="音乐/专辑/歌手/歌单/用户"
            placeholder="音乐/专辑/歌手/歌单/用户"
            v-focus
          />
        </div>
        <div class="center_con">
          <!-- 搜索歌曲列表 -->
          <div class="song_wrapper" ref="song_wrapper">
            <ul class="song_list">
              <li v-for="(item, index) in searchList" :key="index">
                <!-- 点击放歌 -->
                <a
                  href="javascript:;"
                  @click="playMusic(item.id, item.al.id)"
                ></a>
                <b>{{ item.name }}</b>
                <span>
                  <i @click="playMv(item.mv)" v-if="item.mv != 0"></i>
                </span>
              </li>
            </ul>
            <img src="./assets/images/line.png" class="switch_btn" alt="" />
          </div>
          <!-- 歌曲信息容器 -->
          <div class="player_con" :class="{ playing: isPlay }">
            <img src="./assets/images/player_bar.png" class="play_bar" />
            <!-- 黑胶碟片 -->
            <img src="./assets/images/disc.png" class="disc autoRotate" />
            <img
              :src="coverUrl == '' ? '' : coverUrl"
              class="cover autoRotate"
            />
            <p class="textContainer">
              {{ videoUpload.list.name }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                videoUpload.list.artist
              }}
            </p>
          </div>
          <!-- 评论容器 -->
          <div class="comment_wrapper" ref="comment_wrapper">
            <h5 class="title">精彩评论</h5>
            <div class="comment_list">
              <dl v-for="(item, index) in hotComments" :key="index">
                <dt>
                  <img :src="item.user.avatarUrl" alt="" />
                </dt>
                <dd class="name">
                  {{ item.user.nickname }}
                  <svg
                    class="icon"
                    aria-hidden="true"
                    v-show="item.user.vipType != 0"
                  >
                    <use xlink:href="#icon-wodeiconvip2"></use>
                  </svg>
                </dd>
                <dd class="detail">
                  {{ item.content }}
                </dd>
                <dd class="time">
                  {{ item.timeStr }}
                </dd>
              </dl>
            </div>
            <img src="./assets/images/line.png" class="right_line" />
          </div>
        </div>
        <!-- 歌曲播放 -->
        <div class="audio_con">
          <audio
            ref="audio"
            @play="play"
            @pause="pause"
            :src="musicUrl"
            controls
            autoplay
            loop
            class="myaudio"
            id="audio"
          ></audio>
        </div>
        <!-- MV -->
        <div class="video_con" v-show="showVideo">
          <video ref="video" :src="mvUrl" controls loop id="video"></video>
          <div class="mask" @click="closeMv"></div>
        </div>
      </div>
  </div>
</template>
    
<script>
import "./assets/js/iconfont";
import { mapState } from "vuex";

// 这里用于定义Vue组件的业务逻辑
export default {
  name: "App",
  // 生命周期函数:页面一加载就调用
  created() {
    this.$store.dispatch("hotListAsync");
    this.$store.dispatch("recommendNewMusicAsync");
  },
  // 生命周期函数:DOM页面元素渲染完成调用
  mounted() {},
  // 私有数据
  data: () => {
    return {};
  },
  computed: {
    ...mapState([
      "keywords",
      "searchList",
      "musicUrl",
      "isPlay",
      "coverUrl",
      "hotComments",
      "showVideo",
      "mvUrl",
      "lyric",
      "videoUpload",
    ]),
  },
  // 处理函数
  methods: {
    // 监听文本框搜索关键词的变化
    monitorInputValChange(e) {
      this.$store.commit("setInputVal", e.target.value);
    },
    // 搜索音乐、专辑、歌手、歌单、用户
    searchAll() {
      this.$store.dispatch("searchListAsync", this.keywords);
    },
    // 根据音乐id播放
    playMusic(id, albumId) {
      this.$store.commit("setMusicUrl", id);
      this.$store.dispatch("videoUploadAsync", id);
      this.$store.dispatch("coverUrlAsync", albumId);
      this.$store.dispatch("hotCommentsAsync", id);
      this.$store.dispatch("lyricAsync", id);
    },
    // audio的play事件
    play() {
      this.$store.commit("play");
    },
    // audio的pause事件
    pause() {
      this.$store.commit("pause");
    },
    // 播放MV
    playMv(mvId) {
      this.$store.dispatch("mvUrlAsync", mvId);
      // 暂停歌曲播放
      this.$refs.audio.pause();
    },
    // 关闭mv
    closeMv() {
      this.$store.commit("setShowVideo");
      //  暂停视频播放
      this.$refs.video.pause();
      // 开启歌曲播放
      this.$refs.audio.play();
    },
  },
  //其它业务逻辑
};
</script>
    
<style>
/* 这里用于定义组件的样式 */

</style>
