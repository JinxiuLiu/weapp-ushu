/**
 * Created by Liujx on 2017-10-17 10:05:57
 */
const util = require('../../utils/util.js');
const uploadFileUrl = require('../../config.js').uploadFileUrl;
const CreateListUrl = require('../../config.js').CreateListUrl;
var playTimeInterval;
var recordTimeInterval;

Page({
	data: {
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
	    bookListName: '',	// 书单名称
	    videoKey: '',	// 视频key
	    voiceKey: '',	// 音频key
	    imagesKey: [],	// 图片key
	    content: '',	// 书单内容
	    bookKey: []		// 图书key
	},
	bindinput: function(e) {
		this.setData({
	    	bookListName: e.detail.value
	    })
	},
	bindTextArea: function(e) {
		this.setData({
	    	content: e.detail.value
	    })
	},
	chooseVideo: function () {
		var that = this
		wx.chooseVideo({
			success: function (res) {
				that.setData({
					src: res.tempFilePath
				})
				wx.uploadFile({
					url: uploadFileUrl,
					filePath: res.tempFilePath,
					name: 'file',
					success: function(res){
						that.data.videoKey = JSON.parse(res.data).data[0].id;
					},
					fail: function(res) {
						util.showMessage(that, "服务器端错误！", 3000);
					}
				})
			}
		})
	},
	delVideo: function() {
		this.setData({
			src: '',
			videoKey: ''
		})
	},
	onHide: function() {
	    if (this.data.playing) {
	    	this.stopVoice()
	    } else if (this.data.recording) {
	    	this.stopRecordUnexpectedly()
	    }
  	},
  	onShow: function() {
  		let that = this;
  		that.setData({
			bookImgUrl: that.data.bookImgUrl.concat(that.data.tempBookImgUrl),
			bookKey: that.data.bookKey.concat(that.data.tempBookKey)
		})
  	},
	startRecord: function () {
		this.setData({ recording: true })
		var that = this
		recordTimeInterval = setInterval(function () {
			var recordTime = that.data.recordTime += 1
			that.setData({
				formatedRecordTime: util.formatTime(that.data.recordTime),
				recordTime: recordTime
			})
		}, 1000)
		wx.startRecord({
			success: function (res) {
				that.setData({
					hasRecord: true,
					tempFilePath: res.tempFilePath,
					formatedPlayTime: util.formatTime(that.data.playTime)
				})
				wx.uploadFile({
					url: uploadFileUrl,
					filePath: res.tempFilePath,
					name: 'file',
					success: function(res){
						that.data.voiceKey = JSON.parse(res.data).data[0].id;
					},
					fail: function(res) {
						util.showMessage(that, "服务器端错误！", 3000);
					}
				})
			},
			complete: function () {
				that.setData({ recording: false })
				clearInterval(recordTimeInterval)
			}
		})
	},
	stopRecord: function() {
		wx.stopRecord()
	},
	stopRecordUnexpectedly: function () {
		var that = this
		wx.stopRecord({
			success: function() {
				clearInterval(recordTimeInterval)
				that.setData({
					recording: false,
					hasRecord: false,
					recordTime: 0,
					formatedRecordTime: util.formatTime(0)
				})
			}
		})
	},
	playVoice: function () {
		var that = this
		playTimeInterval = setInterval(function () {
			var playTime = that.data.playTime + 1
			that.setData({
				playing: true,
				formatedPlayTime: util.formatTime(playTime),
				playTime: playTime
			})
		}, 1000)
		wx.playVoice({
			filePath: this.data.tempFilePath,
			success: function () {
				clearInterval(playTimeInterval)
				var playTime = 0
				that.setData({
					playing: false,
					formatedPlayTime: util.formatTime(playTime),
					playTime: playTime
				})
			}
		})
	},
	pauseVoice: function () {
		clearInterval(playTimeInterval)
		wx.pauseVoice()
		this.setData({
			playing: false
		})
	},
	stopVoice: function () {
		clearInterval(playTimeInterval)
		this.setData({
			playing: false,
			formatedPlayTime: util.formatTime(0),
			playTime: 0
		})
		wx.stopVoice()
	},
	clear: function () {
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
	},
	chooseImage: function () {
		var that = this
		that.data.imagesKey = [];
		wx.chooseImage({
			count: 9 - that.data.imageList.length,
			success: (res) => {
				that.setData({
					imageList: that.data.imageList.concat(res.tempFilePaths)
				})
				var successUp = 0; //成功个数
                var failUp = 0; //失败个数
                var length = that.data.imageList.length; //总共个数
                var i = 0; //第几个
            	that.uploadDIY(that.data.imageList,successUp,failUp,i,length);
			}
		})
	},
	delImage: function(e) {
		var that = this;
		that.removeByValue(that.data.imageList, e.target.dataset.src)
		that.setData({
			imageList: that.data.imageList
		})
	},
	previewImage: function (e) {
		var current = e.target.dataset.src
		wx.previewImage({
			current: current,
			urls: this.data.imageList
		})
	},
	uploadDIY(filePaths,successUp,failUp,i,length){
		var that = this;
		wx.uploadFile({
			url: uploadFileUrl, 
			filePath: filePaths[i],
			name: 'fileData',
			success: (resp) => {
				successUp++;
				that.data.imagesKey.push({"id": JSON.parse(resp.data).data[0].id})
			},
			fail: (res) => {
				failUp ++;
			},
			complete: () => {
				i ++;
				if(i == length) {
					util.showMessage(that, '总共'+successUp+'张上传成功', 3000);
					that.setData({
						imagesKey: that.data.imagesKey
					})
				} else {  //递归调用uploadDIY函数
					that.uploadDIY(filePaths,successUp,failUp,i,length);
				}
			},
		});
	},
	selectBook: function () {
		let that = this;
		wx.navigateTo({
		  url: './selectBook/selectBook?seq=' + that.data.seq++
		})
	},
	removeByValue: function(arr, val) {
		for(var i=0; i<arr.length; i++) {
		    if(arr[i] == val) {
				arr.splice(i, 1);
				break;
			}
		}
	},
	removeDuplicatedItem: function(ar) {
	    var ret = [];
	    ar.forEach(function(e, i, ar) {
	        if (ar.indexOf(e) === i) {
	            ret.push(e);
	        }
	    });
	    return ret;
	},
	submitFun: function() {
		let that = this;
		let bookListName = that.data.bookListName;
		let videoKey = that.data.videoKey;
		let voiceKey = that.data.voiceKey;
		let imagesKey = that.data.imagesKey;
		let content = that.data.content;
		let bookKey = that.data.bookKey;
		
		wx.request({
			url: CreateListUrl,
			method: 'POST',
			data: {
				"main": {
				    "title": bookListName,
				    "video": {"id": videoKey},
				    "voice": {"id": voiceKey},
				    "images": imagesKey,
				    "content": content
				},
				"items": bookKey
			},
			success: function(result) {
				console.log(result);
				util.showMessage(that, '创建书单成功！', 2000);
			},
			fail: function({errMsg}) {
				console.log('request fail', errMsg)
				self.setData({
					loading: false
				})
			}
	    })
	}
})