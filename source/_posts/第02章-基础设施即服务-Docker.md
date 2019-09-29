---
title:  第02章-基础设施即服务-Docker
CreateTime: 2019-8-29
categories:
- 微服务-Itoken实战
tags:
- 微服务-Itoken实战
---
[toc]

##### 一、Docker
###### 1.1、什么是 Docker ？
>1、Docker 是一个开源的应用容器引擎；是一个轻量级容器技术；
>2、Docker 支持将软件编译成一个镜像；然后在镜像中各种软件做好配置，将镜像发布出去，其他使用者可以直接使用这个镜像；
>3、运行中的这个镜像称为容器，容器启动是非常快速的。

>4、 Docker 与 vmvare 虚拟机都使用了虚拟技术。
>不同之处如下：

![虚拟机](https://i.loli.net/2019/08/29/I5dSWcx1aH82rZf.png)

![Docker](https://i.loli.net/2019/08/29/9ptDQ42uyPdUjTv.png)
>Docker 上运行的应用在系统内存不够时，可以直接使用宿主系统的硬件资源。
>Liunx 虚拟机上的应用程序运行内存只能使用虚拟机操作系统的。不能使用宿主的。

###### 1.2、为什么使用 Docker ？
>1、更高效的利用系统资源
由于容器不需要进行硬件虚拟以及运行完整操作系统等额外开销，Docker 对系统资源的利用率更高。无论是应用执行速度、内存损耗或者文件存储速度，都要比传统虚拟机技术更高效。因此，相比虚拟机技术，一个相同配置的主机，往往可以运行更多数量的应用。

>2、更快速的启动时间
传统的虚拟机技术启动应用服务往往需要数分钟，而 Docker 容器应用，由于直接运行于宿主内核，无需启动完整的操作系统，因此可以做到秒级、甚至毫秒级的启动时间。大大的节约了开发、测试、部署的时间。

>3、一致的运行环境
开发过程中一个常见的问题是环境一致性问题。由于开发环境、测试环境、生产环境不一致，导致有些 bug 并未在开发过程中被发现。而 Docker 的镜像提供了除内核外完整的运行时环境，确保了应用运行环境一致性。

>4、持续交付和部署
对开发和运维（DevOps）人员来说，最希望的就是一次创建或配置，可以在任意地方正常运行。
使用 Docker 可以通过定制应用镜像来实现持续集成、持续交付、部署。开发人员可以通过 Dockerfile 来进行镜像构建，并结合 持续集成(Continuous Integration) 系统进行集成测试，而运维人员则可以直接在生产环境中快速部署该镜像，甚至结合 持续部署(Continuous Delivery/Deployment) 系统进行自动部署。
而且使用 Dockerfile 使镜像构建透明化，不仅仅开发团队可以理解应用运行环境，也方便运维团队理解应用运行所需条件，帮助更好的生产环境中部署该镜像。

>5、更轻松的迁移
由于 Docker 确保了执行环境的一致性，使得应用的迁移更加容易。Docker 可以在很多平台上运行，无论是物理机、虚拟机、公有云、私有云，甚至是笔记本，其运行结果是一致的。因此用户可以很轻易的将在一个平台上运行的应用，迁移到另一个平台上，而不用担心运行环境的变化导致应用无法正常运行的情况。

>6、更轻松的维护和扩展
Docker 使用的分层存储以及镜像的技术，使得应用重复部分的复用更为容易，也使得应用的维护更新更加简单，基于基础镜像进一步扩展镜像也变得非常简单。此外，Docker 团队同各个开源项目团队一起维护了一大批高质量的 官方镜像，既可以直接在生产环境使用，又可以作为基础进一步定制，大大的降低了应用服务的镜像制作成本。

>7、对比传统虚拟机总结

| 特性    | 容器        | 虚拟机    |
|-------|-----------|--------|
| 启动：    | 秒级        | 分钟级    |
| 硬盘使用：  | 一般为 MB    | 一般为 GB |
| 性能 ：   | 接近原生      | 弱于     |
| 系统支持量： | 单机支持上千个容器 | 一般几十个  |


###### 1.3、Docker 引擎
Docker 引擎是一个包含以下主要组件的客户端服务器应用程序。
- 一种服务器，它是一种称为守护进程并且长时间运行的程序。
- REST API用于指定程序可以用来与守护进程通信的接口，并指示它做什么。
- 一个有命令行界面 (CLI) 工具的客户端。

Docker 引擎组件的流程如下图所示：
![Docker引擎](https://i.loli.net/2019/08/29/sjuOlQeNE4zhYmk.png)
shell 命令调用 server docker 守护进程。

###### 1.4、Docker 系统架构
>Docker 使用客户端-服务器 (C/S) 架构模式，使用远程 API 来管理和创建 Docker 容器。
Docker 容器通过 Docker 镜像来创建。
容器与镜像的关系类似于面向对象编程中的对象与类。

| Docker | 面向对象 |
|--------|------|
| 容器     | 对象   |
| 镜像     | 类    |

![系统架构图](https://i.loli.net/2019/08/29/zf5lkg8btwSnFCV.png)

| 标题              | 说明                                                                                                                    |
|-----------------|-----------------------------------------------------------------------------------------------------------------------|
| 镜像\(Images\)    | Docker 镜像是用于创建 Docker 容器的模板。                                                                                          |
| 容器\(Container\) | 容器是独立运行的一个或一组应用。                                                                                                      |
| 客户端\(Client\)   | Docker 客户端通过命令行或者其他工具使用 Docker API \(https://docs\.docker\.com/reference/api/docker\_remote\_api \) 与 Docker 的守护进程通信。 |
| 主机\(Host\)      | 一个物理或者虚拟的机器用于执行 Docker 守护进程和容器。                                                                                       |
| 仓库\(Registry\)  | Docker 仓库用来保存镜像，可以理解为代码控制中的代码仓库。Docker Hub\(https://hub\.docker\.com \) 提供了庞大的镜像集合供使用。                                |
| Docker Machine  | Docker Machine是一个简化Docker安装的命令行工具，通过一个简单的命令行即可在相应的平台上安装Docker，比如VirtualBox、 Digital Ocean、Microsoft Azure。            |


###### 1.5、Docker 镜像
>镜像：可理解成面向对象中的 java 类。是一个个对象实例的 模板。
>容器：容器是独立运行的一个或一组应用。可理解成实例对象。实例对象的属性是一个个应用程序。

###### 1.6、Docker 容器
>镜像：可理解成面向对象中的 java 类。是一个个对象实例的 模板。
>容器：容器是独立运行的一个或一组应用。可理解成实例对象。实例对象的属性是一个个应用程序。

###### 1.7、Docker 仓库
>仓库：Docker 仓库用来保存镜像，可以理解为代码控制中的代码仓库。
>分类：私有仓库、公有仓库。


###### 1.8、安装 Docker

``` shell
1、检查内核版本，必须是3.10及以上
uname -r

2、安装docker
yum install docker

3、输入y确认安装
4、启动docker
[root@localhost ~]# systemctl start docker
[root@localhost ~]# docker -v
Docker version 1.12.6, build 3e8e77d/1.12.6

5、开机启动docker
[root@localhost ~]# systemctl enable docker
Created symlink from /etc/systemd/system/multi-user.target.wants/docker.service to /usr/lib/systemd/system/docker.service.

6、停止docker
systemctl stop docker

```

###### 1.9、Docker 镜像加速器
/etc/docker/daemon.json 中添加

``` json
{
  "registry-mirrors": [
    "https://registry.docker-cn.com"
  ]
}
```

----------


##### 二、Docker 镜像（镜像操作命令）

###### 2-1、从仓库获取镜像

###### 2-2、管理本地主机上的镜像

###### 2-3、介绍镜像实现的基本原理

| 操作 | 命令                                            | 说明                                                     |
| ---- | ----------------------------------------------- | -------------------------------------------------------- |
| 检索 | docker  search 关键字  eg：docker  search redis | 我们经常去docker  hub上检索镜像的详细信息，如镜像的TAG。 |
| 拉取 | docker pull 镜像名:tag                          | :tag是可选的，tag表示标签，多为软件的版本，默认是latest  |
| 列表 | docker images                                   | 查看所有本地镜像                                         |
| 删除 | docker rmi image-id                             | 删除指定的本地镜像                                       |

https://hub.docker.com/

----------


##### 三、Docker 容器(容器操作命令)
软件镜像（QQ安装程序）----运行镜像----产生一个容器（正在运行的软件，运行的QQ）；

步骤：

````shell
1、搜索镜像
[root@localhost ~]# docker search tomcat

2、拉取镜像
[root@localhost ~]# docker pull tomcat

3、根据镜像启动容器
docker run --name mytomcat -d tomcat:latest

4、docker ps  
查看运行中的容器

5、 停止运行中的容器
docker stop  容器的id

6、查看所有的容器
docker ps -a

7、启动容器
docker start 容器id

8、删除一个容器
 docker rm 容器id
 
9、启动一个做了端口映射的tomcat
[root@localhost ~]# docker run -d -p 8888:8080 tomcat
-d：后台运行
-p: 将主机的端口映射到容器的一个端口    主机端口:容器内部的端口

10、为了演示简单关闭了linux的防火墙
service firewalld status ；查看防火墙状态
service firewalld stop：关闭防火墙

11、查看容器的日志
docker logs container-name/container-id

更多命令参看
https://docs.docker.com/engine/reference/commandline/docker/
可以参考每一个镜像的文档

````

----------


##### 四、Docker 仓库


----------


##### 五、Docker 实战

###### 5-1、Docker 安装 MySQL

``` shell
1、拉取 MySQL 镜像
docker pull mysql

2、创建 MySQL 容器并运行：
docker run -p 3306:3306 --name mymysql 
-v $PWD/conf:/etc/mysql/conf.d 
-v $PWD/logs:/logs 
-v $PWD/data:/var/lib/mysql 
-e MYSQL_ROOT_PASSWORD=root 
-d mysql

run:创建容器并运行
-p：映射指定端口
--name：运行容器名称
-v：目录挂载，将

3、进入 MySQL 容器，连接 MySQL。：
docker exec -it mysql bash
mysql -uroot -proot

4、查看用户信息：
 select host,user,plugin,authentication_string from mysql.user;

 备注：
 host为 % 表示不限制ip   
 localhost 表示本机使用    
 plugin 非 mysql_native_password 则需要修改密码

5、修改用户 Hosts ip 访问限制以及密码
 ALTER user 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
 
```

----------
