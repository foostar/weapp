module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.fns = exports.API = undefined;

	var _API = __webpack_require__(1);

	var _API2 = _interopRequireDefault(_API);

	var _fns = __webpack_require__(2);

	var fns = _interopRequireWildcard(_fns);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.API = _API2.default;
	exports.fns = fns;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _fns = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var generateHash = function generateHash() {
	    return (0, _fns.md5)(('' + Date.now()).slice(0, 5) + 'appbyme_key').slice(8, 16);
	};

	var API = function () {
	    function API(rootPath, options) {
	        var _this = this;

	        _classCallCheck(this, API);

	        var defaults = {
	            fetch: fetch,
	            cache: true,
	            logger: console,
	            dataCache: null,
	            parse: function parse(response) {
	                /* eslint-disable */
	                response.headers._headers['content-type'] = 'application/json';
	                _this._cookie = response.headers._headers['set-cookie'];
	                /* eslint-enable */
	                return response.text().then(function (json) {
	                    try {
	                        json = JSON.parse(json);
	                    } catch (err) {
	                        try {
	                            /* eslint-disable */
	                            var vm = __webpack_require__(4);
	                            /* eslint-enable */
	                            var sandbox = { json: null };
	                            var script = new vm.Script('json=' + json, sandbox);
	                            var context = vm.createContext(sandbox);
	                            script.runInContext(context);
	                            json = sandbox.json;
	                        } catch (e) {
	                            json = {};
	                        }
	                    }
	                    return { json: json, response: response };
	                }, function () {
	                    return Promise.reject(new Error('API 格式错误'));
	                });
	            }
	        };
	        this.options = Object.assign(defaults, options);
	        this._rootPath = rootPath;
	        this._path = rootPath + '/mobcent/app/web/index.php';
	        this._sdkVersion = '2.5.0.0';
	        this._egnVersion = '0.3';
	        this._forumKey = '';
	    }

	    _createClass(API, [{
	        key: 'app',
	        value: function app() {
	            return this.fetch('htmlapi/getappinfo');
	        }
	    }, {
	        key: 'ui',
	        value: function ui() {
	            return this.fetch('app/initui');
	        }
	    }, {
	        key: 'custom',
	        value: function custom(id) {
	            return this.fetch('app/moduleconfig', {}, {
	                moduleId: id
	            });
	        }
	    }, {
	        key: 'news',
	        value: function news(id) {
	            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            if (!options.page) options.page = 1;
	            if (!options.pageSize) options.pageSize = 20;
	            options.circle = 1;
	            options.isImageList = 1;
	            options.moduleId = id;

	            return this.fetch('portal/newslist', {}, options);
	        }
	    }, {
	        key: 'article',
	        value: function article(id) {
	            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            if (!options.page) options.page = 1;
	            options.aid = id;
	            options.json = JSON.stringify({
	                aid: options.aid,
	                page: options.page
	            });
	            return this.fetch('portal/newsview', {}, options, 1);
	        }
	    }, {
	        key: 'post',
	        value: function post(id) {
	            var _this2 = this;

	            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            if (!options.boardId) options.boardId = 0;
	            if (!options.page) options.page = 1;
	            if (!options.pageSize) options.pageSize = 20;
	            options.topicId = id;
	            if (this._appId === 41961 || this._appId === 220972) {
	                fetch(this._rootPath + '/mobcent/app/web/updateView.php?tid=' + id).catch(function (err) {
	                    _this2.options.logger.error(err);
	                });
	                return this.fetch('forum/postlist', {}, options);
	            }
	            return this.fetch('forum/postlist', {}, options, 1);
	        }
	    }, {
	        key: 'forum',
	        value: function forum(id) {
	            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            if (!options.boardId) options.boardId = 0;
	            if (!options.page) options.page = 1;
	            if (!options.pageSize) options.pageSize = 20;
	            options.boardId = id || 0; // 0 全部
	            options.circle = 1; // 列表页 数据内容 是否显示更详细 1显示
	            options.isImageList = 1; // 默认都是多图
	            options.topOrder = 1;
	            return this.fetch('forum/topiclist', {}, options);
	        }
	    }, {
	        key: 'forumList',
	        value: function forumList() {
	            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	            return this.fetch('forum/forumlist', {}, options);
	        }
	    }, {
	        key: 'recForumList',
	        value: function recForumList() {
	            var options = arguments.length <= 0 || arguments[0] === undefined ? { type: 'rec' } : arguments[0];

	            return this.fetch('forum/forumlist', {}, options);
	        }
	    }, {
	        key: 'user',
	        value: function user(id) {
	            var options = {
	                userId: id
	            };
	            return this.fetch('user/userinfo', {}, options);
	        }
	    }, {
	        key: 'weChatSignin',
	        value: function weChatSignin(data) {
	            return this.fetch('user/wxlogin', {
	                method: 'POST'
	            }, {
	                json: encodeURIComponent(JSON.stringify(data))
	            });
	        }
	    }, {
	        key: 'signin',
	        value: function signin(username, password) {
	            return this.fetch('user/login', {
	                method: 'POST'
	            }, {
	                username: encodeURIComponent(username),
	                password: password
	            });
	        }
	    }, {
	        key: 'signup',
	        value: function signup(username, password, email) {
	            var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

	            options.username = encodeURIComponent(username);
	            options.password = password;
	            options.email = email;
	            return this.fetch('user/register', {
	                method: 'POST'
	            }, options);
	        }
	    }, {
	        key: 'createTopic',
	        value: function createTopic(json) {
	            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            if (!options.act) {
	                options.act = 'new';
	            }
	            this.clearCache('forum/postlist', {}, {
	                topicId: options.tid,
	                boardId: 0,
	                page: 1,
	                pageSize: 20
	            });
	            var params = Object.assign({}, options, {
	                json: encodeURIComponent(encodeURIComponent(JSON.stringify({
	                    body: {
	                        json: json
	                    }
	                })))
	            });
	            var searchParams = Object.keys(params).map(function (key) {
	                return key + '=' + params[key];
	            }).join('&');
	            return this.fetch('forum/topicadmin', {
	                method: 'POST',
	                body: searchParams,
	                headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded'
	                }
	            }, options);
	        }
	    }, {
	        key: 'uploadAvatar',
	        value: function uploadAvatar(file) {
	            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            var form = new FormData();
	            form.append('userAvatar', file);
	            return this.fetch('user/uploadavatarex', {
	                method: 'POST',
	                body: form,
	                headers: form.getHeaders()
	            }, options);
	        }
	        // 话题列表

	    }, {
	        key: 'topic',
	        value: function topic() {
	            var search = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            options.type = 'UNCARE';
	            if (!options.page) options.page = 1;
	            if (!options.pageSize) options.pageSize = 20;
	            options.search = search;
	            return this.fetch('topic/topiclist', {}, options);
	        }
	        // 话题帖子列表

	    }, {
	        key: 'topicdtl',
	        value: function topicdtl() {
	            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	            if (!options.page) options.page = 1;
	            if (!options.pageSize) options.pageSize = 20;
	            if (!options.circle) options.circle = 1;
	            if (!options.isImageList) options.isImageList = 1;
	            if (!options.orderby) options.orderby = 'NEW';
	            return this.fetch('topic/topicdtl', {}, options);
	        }
	        // 我的话题

	    }, {
	        key: 'mytopic',
	        value: function mytopic() {
	            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	            options.type = 'CARE';
	            return this.fetch('topic/mytopic', {}, options);
	        }
	        // 关注／取消话题

	    }, {
	        key: 'caretpcByTopic',
	        value: function caretpcByTopic(id) {
	            var type = arguments.length <= 1 || arguments[1] === undefined ? 'CARE' : arguments[1];
	            var data = arguments[2];

	            var options = {};
	            options.type = type;
	            options.ti_id = id;

	            // 清除缓存
	            // 未关注列表
	            this.clearCache('topic/topiclist', {}, {
	                type: 'UNCARE',
	                page: data.page,
	                pageSize: data.pageSize,
	                search: data.search
	            });
	            // 已关注列表
	            this.clearCache('topic/mytopic', {}, {
	                type: 'CARE'
	            });
	            // 最新话题帖子列表
	            this.clearCache('topic/topicdtl', {}, {
	                orderby: 'NEW',
	                page: data.page,
	                pageSize: data.pageSize,
	                isImageList: 1,
	                ti_id: id,
	                circle: 1
	            });
	            // 最热话题帖子列表
	            this.clearCache('topic/topicdtl', {}, {
	                orderby: 'HOT',
	                page: data.page,
	                pageSize: data.pageSize,
	                isImageList: 1,
	                ti_id: id,
	                circle: 1
	            });
	            return this.fetch('topic/caretpc', {}, options);
	        }

	        // 帖子搜索

	    }, {
	        key: 'search',
	        value: function search() {
	            var keyword = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	            var type = arguments.length <= 1 || arguments[1] === undefined ? 'post' : arguments[1];
	            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            if (!options.page) options.page = 1;
	            if (!options.pageSize) options.pageSize = 20;
	            if (!options.searchid) options.searchid = 0;
	            options.keyword = encodeURIComponent(keyword);
	            // 帖子搜索
	            if (type === 'post') return this.fetch('forum/search', {}, options);
	            // 文章搜索
	            if (type === 'article') return this.fetch('portal/search', {}, options);
	            // 用户搜索
	            if (type === 'user') return this.fetch('user/searchuser', {}, options);
	        }

	        // 用户列表接口

	    }, {
	        key: 'getUserList',
	        value: function getUserList(uid) {
	            var type = arguments.length <= 1 || arguments[1] === undefined ? 'follow' : arguments[1];
	            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            if (!options.page) options.page = 1;
	            if (!options.pageSize) options.pageSize = 20;
	            // 帖子类型type('all' -->'全部','follow' -->'关注好友', 'followed' --> '粉丝', 'recommend' --> '推荐好友','friend' --> '好友'), 默认为follow
	            options.type = type;
	            options.uid = uid;
	            return this.fetch('user/userlist', {}, options);
	        }

	        // 消息接口 回复与@我列表／好友申请 post,at,friend

	    }, {
	        key: 'getNotifyList',
	        value: function getNotifyList() {
	            var type = arguments.length <= 0 || arguments[0] === undefined ? 'post' : arguments[0];
	            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            if (!options.page) options.page = 1;
	            if (!options.pageSize) options.pageSize = 20;
	            options.type = type;
	            return this.fetch('message/notifylist', {}, options);
	        }

	        // 用户中心发表、回复和关注帖子接口 帖子类型type('topic' -->'发表帖子', 'reply' --> '回复帖子', 'favorite' --> '关注帖子'), 默认为topic

	    }, {
	        key: 'getTopicList',
	        value: function getTopicList(uid) {
	            var type = arguments.length <= 1 || arguments[1] === undefined ? 'topic' : arguments[1];
	            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            if (!options.page) options.page = 1;
	            if (!options.pageSize) options.pageSize = 20;
	            options.type = type;
	            options.uid = uid;
	            return this.fetch('user/topiclist', {}, options);
	        }

	        // 新版上传附件接口 http://wiki.yunpro.cn/index.php?title=%E6%96%B0%E7%89%88%E4%B8%8A%E4%BC%A0%E9%99%84%E4%BB%B6%E6%8E%A5%E5%8F%A3
	        // TODO 后期增加相册和话题图片时 增加处理条件

	    }, {
	        key: 'sendattachmentex',
	        value: function sendattachmentex() {
	            var module = arguments.length <= 0 || arguments[0] === undefined ? 'forum' : arguments[0];

	            var _this3 = this;

	            var files = arguments[1];
	            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            var fs = __webpack_require__(6);
	            if (!options.type) options.type = 'image';
	            options.module = module;
	            var form = new FormData();
	            files.forEach(function (file) {
	                form.append('uploadFile[]', fs.createReadStream(file.path));
	            });
	            return new Promise(function (resolve, reject) {
	                form.getLength(function (err, length) {
	                    if (err) return reject(err);
	                    var headers = form.getHeaders();
	                    headers['Content-Length'] = length;
	                    resolve(_this3.fetch('forum/sendattachmentex', {
	                        method: 'POST',
	                        body: form,
	                        headers: headers
	                    }, options));
	                });
	            });
	        }

	        // 点赞
	        // type('thread(或者topic，均可)' -->'主题帖子', 'post' --> '回帖帖子')

	    }, {
	        key: 'support',
	        value: function support(tid) {
	            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            options.tid = tid;
	            if (!options.type) options.type = 'topic';
	            this.clearCache('forum/postlist', {}, {
	                topicId: tid,
	                boardId: 0,
	                page: 1,
	                pageSize: 20
	            });
	            return this.fetch('forum/support', {}, options);
	        }

	        // 收藏
	        // 操作类型action('favorite' -->'收藏', 'delfavorite' --> '取消收藏'), 默认为favorite
	        // 收藏的id类型idType('tid' -->'帖子','fid' -->'版块'), 默认为tid

	    }, {
	        key: 'userfavorite',
	        value: function userfavorite(id) {
	            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            options.id = id;
	            if (!options.action) options.action = 'favorite';
	            if (!options.idType) options.idType = 'tid';
	            if (options.idType === 'tid') {
	                this.clearCache('forum/postlist', {}, {
	                    topicId: id,
	                    boardId: 0,
	                    page: 1,
	                    pageSize: 20
	                });
	            }
	            return this.fetch('user/userfavorite', {}, options);
	        }

	        // 用户添加取消关注、拉黑取消拉黑接口
	        // 类型type('follow' -->'关注', 'unfollow' --> '取消关注', 'black' --> '拉黑','delblack' --> '取消拉黑'), 默认为follow

	    }, {
	        key: 'useradmin',
	        value: function useradmin() {
	            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	            var tid = arguments[1];

	            if (!options.type) options.type = 'follow';
	            // 如果有tid 那就清除缓存
	            if (tid) {
	                this.clearCache('forum/postlist', {}, {
	                    topicId: tid,
	                    boardId: 0,
	                    page: 1,
	                    pageSize: 20
	                });
	            }

	            return this.fetch('user/useradmin', {}, options);
	        }

	        // 举报

	    }, {
	        key: 'report',
	        value: function report() {
	            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	            return this.fetch('user/report', {}, options);
	        }

	        // 修改密码

	    }, {
	        key: 'updateUserPassword',
	        value: function updateUserPassword(oldPassword, newPassword) {
	            return this.fetch('user/updateuserinfo', {}, {
	                type: 'password',
	                oldPassword: oldPassword,
	                newPassword: newPassword
	            });
	        }

	        // 签到

	    }, {
	        key: 'sign',
	        value: function sign() {
	            return this.fetch('user/sign', {}, {});
	        }
	    }, {
	        key: 'chatInfo',
	        value: function chatInfo() {
	            return this.fetch('chatroom/UserInfo');
	        }
	        // 获取设置

	    }, {
	        key: 'getSetting',
	        value: function getSetting() {
	            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	            // 暂时只用到了 板块的主题获取
	            if (!options.getSetting) {
	                options.getSetting = {
	                    body: {
	                        postInfo: {
	                            forumIds: 0
	                        }
	                    }
	                };
	            }
	            options.getSetting = encodeURIComponent(JSON.stringify(options.getSetting));
	            return this.fetch('user/getsetting', {}, options);
	        }

	        // 获取手机短信验证码接口

	    }, {
	        key: 'getCode',
	        value: function getCode(mobile) {
	            var act = arguments.length <= 1 || arguments[1] === undefined ? 'register' : arguments[1];

	            return this.fetch('app/getcode', {}, {
	                mobile: mobile,
	                act: act
	            });
	        }
	        // 验证手机短信验证码接口

	    }, {
	        key: 'checkMobileCode',
	        value: function checkMobileCode(mobile, code) {
	            var type = arguments.length <= 2 || arguments[2] === undefined ? 'register' : arguments[2];

	            return this.fetch('app/checkmobilecode', {}, {
	                mobile: mobile,
	                code: code,
	                type: type
	            });
	        }
	        // 第三方绑定登录

	    }, {
	        key: 'platFormInfo',
	        value: function platFormInfo(oauthToken, openId) {
	            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	            options.username = encodeURIComponent(options.username);
	            options.isValidation = 1;
	            options.platformId = 30;
	            options.oauthToken = oauthToken;
	            options.openId = openId;

	            return this.fetch('user/platforminfo', {}, options);
	        }

	        // 第三方注册绑定登录信息

	    }, {
	        key: 'savePlatFormInfo',
	        value: function savePlatFormInfo() {
	            var act = arguments.length <= 0 || arguments[0] === undefined ? 'register' : arguments[0];
	            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            options.username = encodeURIComponent(options.username);
	            options.act = act;
	            options.platformId = 60;
	            options.isValidation = 1;
	            return this.fetch('user/saveplatforminfo', {}, options);
	        }
	    }, {
	        key: 'chatList',
	        value: function chatList(cid, page, size) {
	            return this.fetch('chatroom/userlist', {}, {
	                cid: cid,
	                page: page,
	                pageSize: size
	            });
	        }
	    }, {
	        key: 'joinChatRoom',
	        value: function joinChatRoom(cid) {
	            return this.fetch('chatroom/inroom', {
	                method: 'POST'
	            }, {
	                cid: cid
	            });
	        }
	        // 创建话题

	    }, {
	        key: 'subtopic',
	        value: function subtopic(options) {
	            this.clearCache('topic/topiclist', {}, {
	                type: 'UNCARE',
	                page: 1,
	                pageSize: 20,
	                search: ''
	            });
	            return this.fetch('topic/subtopic', {}, options);
	        }
	    }, {
	        key: 'visitor',
	        value: function visitor(cid) {
	            return this.fetch('chatroom/visitor', {}, {
	                cid: cid
	            });
	        }
	    }, {
	        key: 'pluginToken',
	        value: function pluginToken(plugsid) {
	            return this.fetch('plug/token', {}, {
	                plugsid: plugsid
	            });
	        }
	        // 投票

	    }, {
	        key: 'vote',
	        value: function vote(tid, options) {
	            return this.fetch('forum/vote', {}, {
	                tid: tid,
	                options: options
	            });
	        }
	    }, {
	        key: 'getVersion',
	        value: function getVersion() {
	            return this.fetch('htmlapi/getuidiyversion', {}, {});
	        }
	    }, {
	        key: 'fetch',
	        value: function fetch(endpoint) {
	            var request = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            var _this4 = this;

	            var options = arguments[2];
	            var sync = arguments[3];
	            var method = request.method;

	            var fullUrl = this.generateURL(endpoint, options);
	            var cache = (!method || method.toUpperCase() === 'GET') && this.options.cache;

	            if (request.body && typeof request.body !== 'string' && !(request.body instanceof FormData)) {
	                request.body = JSON.stringify(request.body);
	            }
	            var fetchAPI = function fetchAPI(url) {
	                return (0, _fns.timeout)(15000, _this4.options.fetch(url, (0, _fns.merge)({}, {
	                    headers: Object.assign({
	                        Accept: 'application/json',
	                        'Content-Type': 'application/json'
	                    }, (0, _fns.omitBy)({
	                        'X-Real-IP': _this4._realIP,
	                        'X-Forwarded-For': _this4._forwardedFor
	                    }, _fns.isNil))
	                }, request)), { code: null, message: '与服务器连接失败，请稍后重试...' }).then(_this4.options.parse).then(function (_ref) {
	                    var json = _ref.json;
	                    var response = _ref.response;

	                    if (!response.ok) {
	                        return Promise.reject(new Error('服务器状态错误'));
	                    }
	                    if (!json || !json.head) {
	                        return Promise.reject();
	                    }
	                    var code = json.head.errCode;
	                    if (code !== '00000000' && code !== '' && code !== '02000024' && code !== '02000023' && code !== '02000030' && code !== '0000000' && code !== '04000002' // 举报成功
	                    && !(code === '11100001' && json.head.errInfo === '') // platforminfo
	                    // && code !== '01100007' // 抱歉，门户搜索已关闭
	                    // && code !== '00100001' // 需要先登录才能继续本操作
	                    // && code !== '06000001' // 抱歉，您所在的用户组 等待验证会员 无法进行此操作
	                    ) {
	                            return Promise.reject({
	                                status: 400,
	                                message: json.head.errInfo
	                            });
	                        }
	                    return json;
	                }).catch(function (err) {
	                    _this4.options.logger.error(url);
	                    return Promise.reject(err);
	                });
	            };
	            var dataCache = this.options.dataCache;

	            if (cache && dataCache) {
	                dataCache.add(fullUrl, fetchAPI, {
	                    expires: 5 * 60 * 1000,
	                    sync: 2,
	                    force: true
	                });
	                return dataCache.get(fullUrl, { sync: (0, _fns.isNil)(sync) ? 2 : sync });
	            }
	            return fetchAPI(fullUrl);
	        }
	    }, {
	        key: 'generateURL',
	        value: function generateURL(router) {
	            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	            options.sdkVersion = options.sdkVersion || this.sdkVersion;
	            options.egnVersion = options.egnVersion || this.egnVersion;
	            options.accessToken = options.token || this._token;
	            options.accessSecret = options.secret || this._secret;
	            options.forumKey = options.forumKey || this._forumKey;
	            options.apphash = generateHash();

	            return this.path + '?r=' + router + '&' + (0, _fns.raw)(options);
	        }
	    }, {
	        key: 'clearCache',
	        value: function clearCache(endpoint) {
	            var request = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	            var options = arguments[2];

	            var fullUrl = this.generateURL(endpoint, options);
	            var dataCache = this.options.dataCache;

	            dataCache && dataCache.del(fullUrl);
	        }
	    }, {
	        key: 'path',
	        get: function get() {
	            return this._path;
	        }
	    }, {
	        key: 'sdkVersion',
	        get: function get() {
	            return this._sdkVersion;
	        }
	    }, {
	        key: 'egnVersion',
	        get: function get() {
	            return this._egnVersion;
	        }
	    }, {
	        key: 'token',
	        set: function set(token) {
	            this._token = token;
	        }
	    }, {
	        key: 'secret',
	        set: function set(secret) {
	            this._secret = secret;
	        }
	    }, {
	        key: 'forumKey',
	        set: function set(key) {
	            this._forumKey = key;
	        }
	    }]);

	    return API;
	}();

	exports.default = API;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.timeout = exports.merge = exports.omitBy = exports.isNil = exports.raw = exports.md5 = exports.dateFormat = undefined;

	var _blueimpMd = __webpack_require__(3);

	var _blueimpMd2 = _interopRequireDefault(_blueimpMd);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var dateFormat = exports.dateFormat = function dateFormat(date) {
	    var format = arguments.length <= 1 || arguments[1] === undefined ? 'yyyy-MM-dd hh:mm-ss' : arguments[1];
	    var readability = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

	    if (typeof date === 'string' && /^\d+$/.test(date)) {
	        date = new Date(+date);
	    }

	    if (!(date instanceof Date)) {
	        date = new Date(date);
	    }

	    var duration = Date.now() - date;
	    var level1 = 60 * 1000; // 1 分钟
	    var level2 = 60 * 60 * 1000; // 1 小时
	    var level3 = 24 * 60 * 60 * 1000; // 1 天
	    var level4 = 3 * 24 * 60 * 60 * 1000; // 3 天
	    if (readability && duration < level4) {
	        var str = '';
	        if (duration < level1) str = '刚刚';
	        if (duration > level1 && duration < level2) str = Math.round(duration / level1) + '分钟前';
	        if (duration > level2 && duration < level3) str = Math.round(duration / level2) + '小时前';
	        if (duration > level3 && duration < level4) str = Math.round(duration / level3) + '天前';
	        return str;
	    }

	    var o = {
	        'M+': date.getMonth() + 1, // 月份
	        'd+': date.getDate(), // 日
	        'h+': date.getHours(), // 小时
	        'm+': date.getMinutes(), // 分
	        's+': date.getSeconds(), // 秒
	        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
	        S: date.getMilliseconds() };
	    if (/(y+)/.test(format)) {
	        format = format.replace(RegExp.$1, String(date.getFullYear()).substr(4 - RegExp.$1.length));
	    }
	    Object.keys(o).forEach(function (k) {
	        if (new RegExp('(' + k + ')').test(format)) {
	            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(String(o[k]).length));
	        }
	    });
	    return format;
	};

	var md5 = exports.md5 = function md5(str) {
	    return (0, _blueimpMd2.default)(str);
	};

	var raw = exports.raw = function raw(args, up) {
	    return Object.keys(args).sort().reduce(function (a, b) {
	        return a + '&' + (up ? b.toLowerCase() : b) + '=' + args[b];
	    }, '').slice(1);
	};

	var isNil = exports.isNil = function isNil(v) {
	    return v == null;
	};

	var omitBy = exports.omitBy = function omitBy(obj, predicate) {
	    var newObj = {};
	    for (var key in obj) {
	        if (!predicate(obj[key], key)) {
	            newObj[key] = obj[key];
	        }
	    }
	    return newObj;
	};

	var merge = exports.merge = function merge(destination, source) {
	    for (var property in source) {
	        if (source[property] && source[property].constructor && source[property].constructor === Object) {
	            destination[property] = destination[property] || {};
	            merge(destination[property], source[property]);
	        } else {
	            destination[property] = source[property];
	        }
	    }
	    return destination;
	};

	var timeout = exports.timeout = function timeout(ms, promise) {
	    var err = arguments.length <= 2 || arguments[2] === undefined ? new Error('timeout') : arguments[2];
	    return new Promise(function (resolve, reject) {
	        setTimeout(function () {
	            reject(err);
	        }, ms);
	        promise.then(resolve, reject);
	    });
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 * JavaScript MD5
	 * https://github.com/blueimp/JavaScript-MD5
	 *
	 * Copyright 2011, Sebastian Tschan
	 * https://blueimp.net
	 *
	 * Licensed under the MIT license:
	 * http://www.opensource.org/licenses/MIT
	 *
	 * Based on
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for more info.
	 */

	/*global unescape, define, module */

	;(function ($) {
	  'use strict'

	  /*
	  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	  * to work around bugs in some JS interpreters.
	  */
	  function safe_add (x, y) {
	    var lsw = (x & 0xFFFF) + (y & 0xFFFF)
	    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
	    return (msw << 16) | (lsw & 0xFFFF)
	  }

	  /*
	  * Bitwise rotate a 32-bit number to the left.
	  */
	  function bit_rol (num, cnt) {
	    return (num << cnt) | (num >>> (32 - cnt))
	  }

	  /*
	  * These functions implement the four basic operations the algorithm uses.
	  */
	  function md5_cmn (q, a, b, x, s, t) {
	    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
	  }
	  function md5_ff (a, b, c, d, x, s, t) {
	    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
	  }
	  function md5_gg (a, b, c, d, x, s, t) {
	    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
	  }
	  function md5_hh (a, b, c, d, x, s, t) {
	    return md5_cmn(b ^ c ^ d, a, b, x, s, t)
	  }
	  function md5_ii (a, b, c, d, x, s, t) {
	    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
	  }

	  /*
	  * Calculate the MD5 of an array of little-endian words, and a bit length.
	  */
	  function binl_md5 (x, len) {
	    /* append padding */
	    x[len >> 5] |= 0x80 << (len % 32)
	    x[(((len + 64) >>> 9) << 4) + 14] = len

	    var i
	    var olda
	    var oldb
	    var oldc
	    var oldd
	    var a = 1732584193
	    var b = -271733879
	    var c = -1732584194
	    var d = 271733878

	    for (i = 0; i < x.length; i += 16) {
	      olda = a
	      oldb = b
	      oldc = c
	      oldd = d

	      a = md5_ff(a, b, c, d, x[i], 7, -680876936)
	      d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586)
	      c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819)
	      b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330)
	      a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897)
	      d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426)
	      c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341)
	      b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983)
	      a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416)
	      d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417)
	      c = md5_ff(c, d, a, b, x[i + 10], 17, -42063)
	      b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162)
	      a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682)
	      d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101)
	      c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290)
	      b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329)

	      a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510)
	      d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632)
	      c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713)
	      b = md5_gg(b, c, d, a, x[i], 20, -373897302)
	      a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691)
	      d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083)
	      c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335)
	      b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848)
	      a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438)
	      d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690)
	      c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961)
	      b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501)
	      a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467)
	      d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784)
	      c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473)
	      b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734)

	      a = md5_hh(a, b, c, d, x[i + 5], 4, -378558)
	      d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463)
	      c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562)
	      b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556)
	      a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060)
	      d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353)
	      c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632)
	      b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640)
	      a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174)
	      d = md5_hh(d, a, b, c, x[i], 11, -358537222)
	      c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979)
	      b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189)
	      a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487)
	      d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835)
	      c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520)
	      b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651)

	      a = md5_ii(a, b, c, d, x[i], 6, -198630844)
	      d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415)
	      c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905)
	      b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055)
	      a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571)
	      d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606)
	      c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523)
	      b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799)
	      a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359)
	      d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744)
	      c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380)
	      b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649)
	      a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070)
	      d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379)
	      c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259)
	      b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551)

	      a = safe_add(a, olda)
	      b = safe_add(b, oldb)
	      c = safe_add(c, oldc)
	      d = safe_add(d, oldd)
	    }
	    return [a, b, c, d]
	  }

	  /*
	  * Convert an array of little-endian words to a string
	  */
	  function binl2rstr (input) {
	    var i
	    var output = ''
	    var length32 = input.length * 32
	    for (i = 0; i < length32; i += 8) {
	      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF)
	    }
	    return output
	  }

	  /*
	  * Convert a raw string to an array of little-endian words
	  * Characters >255 have their high-byte silently ignored.
	  */
	  function rstr2binl (input) {
	    var i
	    var output = []
	    output[(input.length >> 2) - 1] = undefined
	    for (i = 0; i < output.length; i += 1) {
	      output[i] = 0
	    }
	    var length8 = input.length * 8
	    for (i = 0; i < length8; i += 8) {
	      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32)
	    }
	    return output
	  }

	  /*
	  * Calculate the MD5 of a raw string
	  */
	  function rstr_md5 (s) {
	    return binl2rstr(binl_md5(rstr2binl(s), s.length * 8))
	  }

	  /*
	  * Calculate the HMAC-MD5, of a key and some data (raw strings)
	  */
	  function rstr_hmac_md5 (key, data) {
	    var i
	    var bkey = rstr2binl(key)
	    var ipad = []
	    var opad = []
	    var hash
	    ipad[15] = opad[15] = undefined
	    if (bkey.length > 16) {
	      bkey = binl_md5(bkey, key.length * 8)
	    }
	    for (i = 0; i < 16; i += 1) {
	      ipad[i] = bkey[i] ^ 0x36363636
	      opad[i] = bkey[i] ^ 0x5C5C5C5C
	    }
	    hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
	    return binl2rstr(binl_md5(opad.concat(hash), 512 + 128))
	  }

	  /*
	  * Convert a raw string to a hex string
	  */
	  function rstr2hex (input) {
	    var hex_tab = '0123456789abcdef'
	    var output = ''
	    var x
	    var i
	    for (i = 0; i < input.length; i += 1) {
	      x = input.charCodeAt(i)
	      output += hex_tab.charAt((x >>> 4) & 0x0F) +
	      hex_tab.charAt(x & 0x0F)
	    }
	    return output
	  }

	  /*
	  * Encode a string as utf-8
	  */
	  function str2rstr_utf8 (input) {
	    return unescape(encodeURIComponent(input))
	  }

	  /*
	  * Take string arguments and return either raw or hex encoded strings
	  */
	  function raw_md5 (s) {
	    return rstr_md5(str2rstr_utf8(s))
	  }
	  function hex_md5 (s) {
	    return rstr2hex(raw_md5(s))
	  }
	  function raw_hmac_md5 (k, d) {
	    return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))
	  }
	  function hex_hmac_md5 (k, d) {
	    return rstr2hex(raw_hmac_md5(k, d))
	  }

	  function md5 (string, key, raw) {
	    if (!key) {
	      if (!raw) {
	        return hex_md5(string)
	      }
	      return raw_md5(string)
	    }
	    if (!raw) {
	      return hex_hmac_md5(key, string)
	    }
	    return raw_hmac_md5(key, string)
	  }

	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return md5
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  } else if (typeof module === 'object' && module.exports) {
	    module.exports = md5
	  } else {
	    $.md5 = md5
	  }
	}(this))


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var indexOf = __webpack_require__(5);

	var Object_keys = function (obj) {
	    if (Object.keys) return Object.keys(obj)
	    else {
	        var res = [];
	        for (var key in obj) res.push(key)
	        return res;
	    }
	};

	var forEach = function (xs, fn) {
	    if (xs.forEach) return xs.forEach(fn)
	    else for (var i = 0; i < xs.length; i++) {
	        fn(xs[i], i, xs);
	    }
	};

	var defineProp = (function() {
	    try {
	        Object.defineProperty({}, '_', {});
	        return function(obj, name, value) {
	            Object.defineProperty(obj, name, {
	                writable: true,
	                enumerable: false,
	                configurable: true,
	                value: value
	            })
	        };
	    } catch(e) {
	        return function(obj, name, value) {
	            obj[name] = value;
	        };
	    }
	}());

	var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
	'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
	'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
	'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
	'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

	function Context() {}
	Context.prototype = {};

	var Script = exports.Script = function NodeScript (code) {
	    if (!(this instanceof Script)) return new Script(code);
	    this.code = code;
	};

	Script.prototype.runInContext = function (context) {
	    if (!(context instanceof Context)) {
	        throw new TypeError("needs a 'context' argument.");
	    }
	    
	    var iframe = document.createElement('iframe');
	    if (!iframe.style) iframe.style = {};
	    iframe.style.display = 'none';
	    
	    document.body.appendChild(iframe);
	    
	    var win = iframe.contentWindow;
	    var wEval = win.eval, wExecScript = win.execScript;

	    if (!wEval && wExecScript) {
	        // win.eval() magically appears when this is called in IE:
	        wExecScript.call(win, 'null');
	        wEval = win.eval;
	    }
	    
	    forEach(Object_keys(context), function (key) {
	        win[key] = context[key];
	    });
	    forEach(globals, function (key) {
	        if (context[key]) {
	            win[key] = context[key];
	        }
	    });
	    
	    var winKeys = Object_keys(win);

	    var res = wEval.call(win, this.code);
	    
	    forEach(Object_keys(win), function (key) {
	        // Avoid copying circular objects like `top` and `window` by only
	        // updating existing context properties or new properties in the `win`
	        // that was only introduced after the eval.
	        if (key in context || indexOf(winKeys, key) === -1) {
	            context[key] = win[key];
	        }
	    });

	    forEach(globals, function (key) {
	        if (!(key in context)) {
	            defineProp(context, key, win[key]);
	        }
	    });
	    
	    document.body.removeChild(iframe);
	    
	    return res;
	};

	Script.prototype.runInThisContext = function () {
	    return eval(this.code); // maybe...
	};

	Script.prototype.runInNewContext = function (context) {
	    var ctx = Script.createContext(context);
	    var res = this.runInContext(ctx);

	    forEach(Object_keys(ctx), function (key) {
	        context[key] = ctx[key];
	    });

	    return res;
	};

	forEach(Object_keys(Script.prototype), function (name) {
	    exports[name] = Script[name] = function (code) {
	        var s = Script(code);
	        return s[name].apply(s, [].slice.call(arguments, 1));
	    };
	});

	exports.createScript = function (code) {
	    return exports.Script(code);
	};

	exports.createContext = Script.createContext = function (context) {
	    var copy = new Context();
	    if(typeof context === 'object') {
	        forEach(Object_keys(context), function (key) {
	            copy[key] = context[key];
	        });
	    }
	    return copy;
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	
	var indexOf = [].indexOf;

	module.exports = function(arr, obj){
	  if (indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	

/***/ }
/******/ ]);