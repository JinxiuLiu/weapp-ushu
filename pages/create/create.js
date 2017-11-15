/**
 * Created by Liujx on 2017-10-17 10:05:57
 */
const util = require('../../utils/util.js');
const uploadFileUrl = require('../../config').uploadFileUrl;
const CreateListUrl = require('../../config').CreateListUrl;
const detailUrl = require('../../config').detailUrl;
var playTimeInterval;
var recordTimeInterval;
let sessionId = wx.getStorageSync('sessionId')
Page({
    data: {
        isEdit: false,
        isSelectBook: false,
        bookListId: '',
        imagesAllKey: [],
        src: '',
        imageList: [],
        bookImgUrl: [],
        tempBookImgUrl: [],
        tempBookKey: [],
        recording: false,
        playing: false,
        hasRecord: false,
        recordTime: 0,
        playTime: 0,
        seq: 1,
        formatedRecordTime: '00:00:00',
        formatedPlayTime: '00:00:00',
        bookListName: '', // 书单名称
        videoKey: '', // 视频key
        voiceKey: '', // 音频key
        imagesKey: [], // 图片key
        content: '', // 书单内容
        bookKey: [] // 图书key
    },
    // 页面隐藏
    onHide: function() {
        if (this.data.playing) {
            this.stopVoice()
        } else if (this.data.recording) {
            this.stopRecordUnexpectedly()
        }
        if (!this.data.isSelectBook) {
            this.setData({
                isDel: false,
                editImagesKey: [],
                isEdit: false,
                isDisabled: false,
                bookListId: '',
                src: '',
                imageList: [],
                bookImgUrl: [],
                tempBookImgUrl: [],
                tempBookKey: [],
                recording: false,
                playing: false,
                hasRecord: false,
                recordTime: 0,
                playTime: 0,
                seq: 1,
                voiceSrc: '',
                formatedRecordTime: '00:00:00',
                formatedPlayTime: '00:00:00',
                bookListName: '', // 书单名称
                videoKey: '', // 视频key
                voiceKey: '', // 音频key
                imagesKey: [], // 图片key
                tempImagesKey: [], // 图片key
                imagesAllKey: [],
                content: '', // 书单内容
                bookKey: [], // 图书key
            })
        }
        this.setData({
            isSelectBook: false,
        })
        // 删除 缓存中的bookListId
        wx.removeStorage({
            key: 'bookListId'
        })
    },
    // 页面显示
    onShow: function(option) {
        let self = this;
        if (self.data.isSelectBook) {
            self.setData({
                bookImgUrl: self.data.bookImgUrl.concat(self.data.tempBookImgUrl),
                bookKey: self.data.bookKey.concat(self.data.tempBookKey)
            })
        }
        wx.getStorage({
            key: 'bookListId',
            success: data => {
                let bookListId = data.data;
                if (!bookListId) return false;
                wx.request({
                    url: detailUrl,
                    method: 'POST',
                    data: {
                        id: bookListId
                    },
                    header: {
                        'content-type': 'application/x-www-form-urlencoded', // 默认值
                        'Cookie': 'JSESSIONID=' + sessionId
                    },
                    success: data => {
                        if (data.data.success) {
                            let item = data.data.data;
                            let tempImageList = [];
                            let tempBookImgUrl = [];
                            self.data.bookKey = [];
                            wx.setNavigationBarTitle({
                                title: '编辑书单'
                            })
                            item.images.filter(function(item) {
                                tempImageList.push(item.url);
                                self.data.imagesKey.push({ "id": item.id })
                            })
                            item.items.filter(function(item, index) {
                                tempBookImgUrl.push(item.picPath);
                                self.data.bookKey.push({ 'bookId': item.bookId, "id": item.id, "seq": index + 1 });
                            })
                            self.setData({
                                isEdit: true,
                                seq: item.items.length + 1,
                                bookListId: bookListId,
                                bookListName: item.title,
                                src: item.video ? item.video.url : '',
                                videoKey: item.video ? item.video.id : '',
                                voiceKey: item.voice ? item.voice.id : '',
                                voiceSrc: item.voice ? item.voice.url : '',
                                imageList: tempImageList,
                                imagesKey: self.data.imagesKey,
                                editImagesKey: self.data.imagesKey,
                                content: item.content,
                                bookImgUrl: tempBookImgUrl,
                                bookKey: self.data.bookKey,
                                imagesAllKey: [],
                            })
                        } else {
                            util.showMessage(self, data.data.msg)
                        }
                    }
                })
            }
        })
    },
    // 书单名称 输入
    bindinput: function(e) {
        this.setData({
            bookListName: e.detail.value
        })
    },
    // 书单内容 输入
    bindTextArea: function(e) {
        this.setData({
            content: e.detail.value
        })
    },
    // 上传视频
    chooseVideo: function() {
        var self = this
        self.data.isSelectBook = true;
        wx.chooseVideo({
            sourceType: ['camera'],
            success: function(res) {
                self.setData({
                    src: res.tempFilePath
                })
                wx.uploadFile({
                    url: uploadFileUrl,
                    filePath: res.tempFilePath,
                    name: 'file',
                    success: function(res) {
                        self.data.videoKey = JSON.parse(res.data).data[0].id;
                    },
                    fail: function(res) {
                        util.showMessage(self, "服务器端错误！", 3000);
                    }
                })
            }
        })
    },
    // 删除视频
    delVideo: function() {
        this.setData({
            src: '',
            videoKey: ''
        })
    },
    // 开始录音
    startRecord: function() {
        this.setData({ recording: true })
        var self = this
        recordTimeInterval = setInterval(function() {
            var recordTime = self.data.recordTime += 1
            self.setData({
                formatedRecordTime: util.formatTime(self.data.recordTime),
                recordTime: recordTime
            })
        }, 1000)
        wx.startRecord({
            success: function(res) {
                self.setData({
                    hasRecord: true,
                    tempFilePath: res.tempFilePath,
                    formatedPlayTime: util.formatTime(self.data.playTime)
                })
                wx.uploadFile({
                    url: uploadFileUrl,
                    filePath: res.tempFilePath,
                    name: 'file',
                    success: function(res) {
                        self.data.voiceKey = JSON.parse(res.data).data[0].id;
                    },
                    fail: function(res) {
                        util.showMessage(self, "服务器端错误！", 3000);
                    }
                })
            },
            complete: function() {
                self.setData({ recording: false })
                clearInterval(recordTimeInterval)
            }
        })
    },
    // 停止录音
    stopRecord: function() {
        wx.stopRecord()
    },
    stopRecordUnexpectedly: function() {
        var self = this
        wx.stopRecord({
            success: function() {
                clearInterval(recordTimeInterval)
                self.setData({
                    recording: false,
                    hasRecord: false,
                    recordTime: 0,
                    formatedRecordTime: util.formatTime(0)
                })
            }
        })
    },
    playVoice: function() {
        var self = this
        playTimeInterval = setInterval(function() {
            var playTime = self.data.playTime + 1
            self.setData({
                playing: true,
                formatedPlayTime: util.formatTime(playTime),
                playTime: playTime
            })
        }, 1000)
        wx.playVoice({
            filePath: this.data.tempFilePath,
            success: function() {
                clearInterval(playTimeInterval)
                var playTime = 0
                self.setData({
                    playing: false,
                    formatedPlayTime: util.formatTime(playTime),
                    playTime: playTime
                })
            }
        })
    },
    pauseVoice: function() {
        clearInterval(playTimeInterval)
        wx.pauseVoice()
        this.setData({
            playing: false
        })
    },
    stopVoice: function() {
        clearInterval(playTimeInterval)
        this.setData({
            playing: false,
            formatedPlayTime: util.formatTime(0),
            playTime: 0
        })
        wx.stopVoice()
    },
    clear: function() {
        if (this.data.voiceSrc) {
            this.setData({
                voiceSrc: ''
            })
        } else {
            clearInterval(playTimeInterval)
            wx.stopVoice()
            this.setData({
                playing: false,
                hasRecord: false,
                tempFilePath: '',
                formatedRecordTime: util.formatTime(0),
                recordTime: 0,
                playTime: 0
            })
        }
    },
    // 上传图片
    chooseImage: function() {
        let self = this
        self.data.tempImagesKey = [];
        self.data.isSelectBook = true;
        wx.chooseImage({
            count: 9 - self.data.imageList.length,
            success: (res) => {
                self.setData({
                    imageList: self.data.imageList.concat(res.tempFilePaths)
                })
                let successUp = 0; //成功个数
                let failUp = 0; //失败个数
                let length = self.data.imageList.length; //总共个数
                let i = 0; //第几个
                self.uploadDIY(self.data.imageList, successUp, failUp, i, length);
            }
        })
    },
    // 递归 上传图片
    uploadDIY(filePaths, successUp, failUp, i, length) {
        var self = this;
        wx.uploadFile({
            url: uploadFileUrl,
            filePath: filePaths[i],
            name: 'fileData',
            success: (resp) => {
                successUp++;
                self.data.tempImagesKey.push({ "id": JSON.parse(resp.data).data[0].id })
            },
            fail: (res) => {
                failUp++;
            },
            complete: (res) => {
                i++;
                if (i == length) {
                    util.showMessage(self, '总共' + successUp + '张上传成功', 3000);
                    self.setData({
                        isDel: false,
                        tempImagesKey: self.data.tempImagesKey,
                        imagesAllKey: self.data.imagesKey.concat(self.data.tempImagesKey),
                        editImagesKey: self.data.imagesKey.concat(self.data.tempImagesKey)
                    })
                } else { //递归调用uploadDIY函数
                    self.uploadDIY(filePaths, successUp, failUp, i, length);
                }
            },
        });
    },
    // 删除图片
    delImage: function(e) {
        var self = this;
        let index = e.target.dataset.index;
        let imagesKey = self.data.imagesKey;
        let imagesAllKey = self.data.imagesAllKey;
        let array;
        if (imagesAllKey.length) {
            array = imagesAllKey
        } else {
            array = imagesKey
        }
        array.splice(index, 1);
        self.removeByValue(self.data.imageList, e.target.dataset.src)
        self.setData({
            isDel: true,
            imageList: self.data.imageList,
        })
        if (imagesAllKey.length) {
            self.setData({
                imagesAllKey: array
            })
        } else {
            self.setData({
                imagesKey: array
            })
        }
        if (this.data.isEdit) {
            self.setData({
                editImagesKey: array
            })
        }
    },
    // 查看图片大图
    previewImage: function(e) {
        var current = e.target.dataset.src
        this.setData({
            isSelectBook: true
        })
        wx.previewImage({
            current: current,
            urls: this.data.imageList
        })

    },
    // 选择图书
    selectBook: function() {
        let self = this;
        self.setData({
            isSelectBook: true
        })
        wx.navigateTo({
            url: './selectBook/selectBook?seq=' + (self.data.bookImgUrl.length + 1)
        })
    },
    // 查看图书详情 => id有误，后端处理
    tapBookFun: function(e) {
        let id = e.currentTarget.dataset.id
        this.setData({
            isSelectBook: true
        })
        wx.navigateTo({
            url: '../bookDetails/bookDetails?id=' + id
        })
    },
    // 删除数组某一项
    removeByValue: function(arr, val) {
        for (var i = 0; i < arr.length; i++) {    
            if (arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    },
    // 提交书单
    submitFun: function() {
        let self = this;
        let bookListName = self.data.bookListName;
        let videoKey = self.data.videoKey;
        let voiceKey = self.data.voiceKey;
        let imagesKey = self.data.imagesKey;
        let content = self.data.content;
        let bookKey = self.data.bookKey;
        let bookListId = self.data.bookListId;
        let imagesAllKey = self.data.imagesAllKey;
        if (imagesAllKey.length) {
            imagesAllKey = imagesKey.concat(imagesAllKey);
        } else {
            imagesAllKey = imagesKey;
        }
        if (this.data.isEdit) {
            imagesAllKey = this.data.editImagesKey;
        }
        if (self.trim(bookListName) == '') {
            util.showMessage(self, '书单名称不能为空！', 2000);
            return false;
        }
        if (self.trim(content) == '') {
            util.showMessage(self, '书单内容不能为空！', 2000);
            return false;
        }
        if (!bookKey.length) {
            util.showMessage(self, '请选择图书！', 2000);
            return false;
        }
        this.setData({
            isDisabled: true
        })
        wx.request({
            url: CreateListUrl,
            method: 'POST',
            data: {
                "main": {
                    "title": bookListName,
                    "video": { "id": videoKey },
                    "voice": { "id": voiceKey },
                    "images": imagesAllKey,
                    "content": content,
                    "id": bookListId
                },
                "items": bookKey
            },
            header: {
                'Cookie': 'JSESSIONID=' + sessionId
            },
            success: result => {
                if (result.data.success) {
                    util.showMessage(self, result.data.msg, 2000);

                    setTimeout(function() {
                        self.setData({
                            isSelectBook: false,
                            isDisabled: false
                        })
                        if(result.data.data.published) {
                            wx.setStorageSync('isCreate', true)
                            wx.switchTab({
                                url: '../index/index'
                            })
                        } else {
                            wx.navigateTo({
                                url: '../user/myBookList/myBookList'
                            })
                        }
                        
                    }, 500)
                } else {
                    util.showMessage(self, result.data.msg, 2000);
                    this.setData({
                        isDisabled: false
                    })
                }
            },
            fail: function({ errMsg }) {
                util.showMessage(self, errMsg, 2000);
                self.setData({
                    loading: false,
                    isDisabled: false
                })
            }
        })
    },
    // 去首尾空格
    trim: function(str) {
        return str.replace(/(^\s+)|(\s+$)/g, "");
    }
})