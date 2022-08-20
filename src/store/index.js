import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// 配置请求的基准URL地址
axios.defaults.baseURL = 'http://cloud-music.pl-fe.cn/'
//axios设置响应拦截器
axios.interceptors.response.use(response => {
  return response.data //拦截处理响应结果，直接返回需要的数据
}, err => {
  console.log(err)
})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 搜索歌单列表
    searchList: [],
    // 热歌榜
    hotList: [],
    // 搜索关键词
    keywords: '',
    // 音乐地址
    musicUrl: "",
    // 是否正在播放
    isPlay: false,
    // 音乐封面地址
    coverUrl: '',
    // 音乐热门评论
    hotComments: [],
    // 显示视频播放
    showVideo: false,
    // mv地址
    mvUrl: '',
    // 歌词
    lyric: '',
    // 音乐播放信息
    videoUpload: {
      list: { // 当前播放的音乐
        name: '',
        artist: '',
        url: "",
        // 封面图片
        cover: ''
      }
    }
  },
  getters: {},
  mutations: {
    // 监听并设置文本框搜索关键词的变化
    setInputVal(state, val) {
      state.keywords = val
    },
    // 获取搜索歌单列表
    setSearchList(state, list) {
      state.searchList = list
      state.keywords = ''
    },
    // 获取音乐地址
    setMusicUrl(state, id) {
      state.musicUrl = "http://music.163.com/song/media/outer/url?id=" + id + ".mp3"
    },
    // 监听audio的play事件
    play(state) {
      state.isPlay = true
      // 清空mv的信息
      state.mvUrl = ""
    },
    // 监听audio的pause事件
    pause(state) {
      state.isPlay = false
    },
    // 获取音乐封面地址
    setCoverUrl(state, url) {
      state.coverUrl = url
    },
    // 获取音乐热门评论
    setHotComments(state, info) {
      state.hotComments = info
    },
    // 获取mv地址
    setMvUrl(state, url) {
      state.mvUrl = url
      state.showVideo = true
    },
    // 监听mv关闭
    setShowVideo(state) {
      state.showVideo = false;
    },
    // 获取歌词
    getLyric(state, lyric) {
      state.lyric = lyric
    },
    // 获取音乐播放信息
    setVideoUpload(state, info) {
      state.videoUpload.list.artist = ""
      // 当前播放的音乐
      state.videoUpload.list.name = info.name
      for (let i = 0; i < info.ar.length; i++) {
        state.videoUpload.list.artist += info.ar[i].name + ' / '
      }
      state.videoUpload.list.artist = state.videoUpload.list.artist.slice(0, -2)
      state.videoUpload.list.url = state.musicUrl
      // 封面图片
      state.videoUpload.list.cover = info.al.picUrl
    },
    // 获取热歌榜
    getHotList(state, list) {
      state.hotList = list
      state.searchList = state.hotList
    },
    // 获取推荐新音乐播放信息
    setRecommendNewMusic(state, info) {
      state.videoUpload.list.name = info.name
      state.videoUpload.list.artist = info.artistsname
      state.videoUpload.list.url = info.url
      state.videoUpload.list.cover = info.picurl
    }
  },
  actions: {
    // 异步获取搜索歌单列表数据
    async searchListAsync(context, keywords) {
      const res = await axios.get('cloudsearch', {
        params: {
          keywords,
          limit: 100
        }
      })
      context.commit('setSearchList', res.result.songs)
    },
    // 异步获取音乐封面地址
    async coverUrlAsync(context, id) {
      const res = await axios.get('album', {
        params: {
          id
        }
      })
      context.commit('setCoverUrl', res.album.picUrl)
    },
    // 异步获取音乐热门评论
    async hotCommentsAsync(context, id) {
      const res = await axios.get('comment/hot', {
        params: {
          id,
          type: 0
        }
      })
      context.commit('setHotComments', res.hotComments)
    },
    // 异步获取mv地址
    async mvUrlAsync(context, id) {
      const res = await axios.get('mv/url', {
        params: {
          id
        }
      })
      context.commit('setMvUrl', res.data.url)
    },
    // 异步获取歌词
    async lyricAsync(context, id) {
      const res = await axios.get('lyric', {
        params: {
          id
        }
      })
      context.commit('getLyric', res.lrc.lyric)
    },
    // 异步获取歌曲/歌手/封面图片
    async videoUploadAsync(context, ids) {
      const res = await axios.get('song/detail', {
        params: {
          ids
        }
      })
      context.commit('setVideoUpload', res.songs[0])
    },
    // 异步获取热歌榜
    async hotListAsync(context) {
      const res = await axios.get('playlist/detail', {
        params: {
          id: 3778678
        }
      })
      context.commit('getHotList', res.playlist.tracks)
    },
    // 异步获取推荐新音乐
    async recommendNewMusicAsync(context) {
      const res = await axios.get('https://api.uomg.com/api/rand.music', {
        params: {
          sort: "热歌榜",
          format: "json"
        }
      })
      const index = res.data.url.indexOf('=');
      const id = res.data.url.substr(index + 1);
      context.commit('setMusicUrl', id)
      context.commit('setCoverUrl', res.data.picurl)
      context.commit('setRecommendNewMusic', res.data)
      context.dispatch('hotCommentsAsync', id)
    },
  },
  modules: {}
})