
/**
 * Module dependencies.
 */

var express = require('express'); //引入express模块
var routes = require('./routes'); //引入路由控制 相当于引入'routes/index'
var user = require('./routes/user');
var http = require('http'); 
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000); //服务器监听端口
app.set('views', path.join(__dirname, 'views')); //模板文件（视图模块）的路径
app.set('view engine', 'ejs'); //模板引擎 使用ejs
app.use(flash()); 
app.use(express.favicon()); //使用默认的favicon图标，如果想使用自己的图标，需改为express.favicon(__dirname + '/public/images/favicon.ico')
app.use(express.logger('dev')); //在开发环境下使用，在终端显示简单的日志
app.use(express.bodyParser({
	keepExtensions: true, //保留上传文件的文件名
	uploadDir: './public/images' //将上传目录设置为/public/images
})); //解析请求体
app.use(express.methodOverride()); //协助处理post请求，伪装put、delete和其他http方法
app.use(express.cookieParser());
app.use(express.session({
	secret: settings.cookieSecret,
	key: settings.db, //cookie name
	cookie: {maxAge: 1000*60*60*24*24*30}, //30 days
	store: new MongoStore({
		db: settings.db
	})
}));
app.use(app.router); //调用路由解析的规则
app.use(express.static(path.join(__dirname, 'public'))); //讲根目录下的public文件夹设置为存放静态文件的目录

// development only 配置开发环境下的错误处理，输出错误信息
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// app.get('/', routes.index);
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

routes(app);