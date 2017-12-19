1、新建工作区目录
 
    mkdir workspace 
2、进入工作区目录
 
    cd workspace 
3、配置git访问权限

	name：git config --global user.name zhangsan
    email：git config --global user.email zhangsan@rongcapital.cn
4、生成SSH密钥过程
	 
     1.查看是否已经有了ssh密钥：cd ~/.ssh
	   如果没有密钥则不会有此文件夹，有则备份删除
     2.生成密钥：
       $ ssh-keygen -t rsa -C "gitLab的账户邮箱"
       按3个回车，密码为空。
     最后得到了两个文件：id_rsa和id_rsa.pub。它们的默认存放目录是C:\Users\Administrator\。

5、添加密钥到gitLab

     登录访问 http://gitlab.dataengine.com/profile。
     在SSH keys里点击Add SSH Key 按钮。自定义一个title，将生成的key粘贴上去，然后提交。 

6、下载项目到工作区目录    
	
	git clone git@gitlab.dataengine.com:tianliqiang1/Cube.git

7、进入项目文件夹(Cube)

	cd Cube
8、安装项目

	cnpm install 

    安装forever命令
    cnpm install forever 

9、启动项目
     
    启动node并保持它在后台运行，同时启动项目代码监听功能。可以执行以下命令：
    npm run keepStart 

    npm run dev  
    启动项目并且打开文件变更监控控制台
    目前设置的默认端口为8091 (为了不和之前用的8090冲突)。若需要变更可以到./bin/www文件里修改端口 

    你也可以只启动nodejs项目。启动方式如下：
    npm run start

    当然，你也可以只启动文件变更监控控制台。命令如下：
    npm run react


10、访问方法：

    http://localhost:8091/pc/index.html 
    或者 
    http://localhost:8091/pc

11、生产环境打包

    打包发布生产环境的时候用以下命令：
    npm run buildProduction

    若想打包并启动项目用以下命令：
    npm run pro

另：若启动有问题，建议先删除node_modules文件夹重新执行cnpm install 。


 框架仍在努力的完善中，敬请期待...