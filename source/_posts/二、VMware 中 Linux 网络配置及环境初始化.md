---
title: 二、VMware 中 Linux 网络配置及环境初始化
CreateTime: 2019-8-15
categories:
- Linux 学习
tags:
- Linux 学习
---

[toc]

##### 一、linux 网络连接问题

弹出界面eth0：错误：激活连接失败：Device not managed by NetworkManager or unavailable
参考：<https://my.oschina.net/u/2324318/blog/1814002>

##### 二、linux 配置静态ip，方便 xshell 远程

###### 2-1、修改网络配置文件

参考：<https://blog.csdn.net/attend_/article/details/79025172>

``` shell
EVICE=eth0
TYPE=Ethernet
UUID=d3349997-0d0c-48c4-be1c-189f960ebfdd
ONBOOT=yes
NM_CONTROLLED=yes
BOOTPROTO=static
IPADDR=192.168.2.129
GATEWAY=192.168.2.1
DNS1=222.168.160.70
DNS2=114.114.114.114
DEFROUTE=yes
IPV4_FAILURE_FATAL=yes
IPV6INIT=noNAME="System eth0"
HWADDR=00:0c:29:b3:31:cd
LAST_CONNECT=1556613678
NETMASK=255.255.255.0
USERCTL=no
PEERDNS=yes
```

###### 2-2、静态ip 配置好后，重启网络服务 

centos7 网卡出现问题。不能重启网络服务
参考：https://www.cnblogs.com/wudonghang/p/c0cd315470b06ef0f455855fe36c222c.html

``` shell
systemctl network restart

```

###### 2-3、关闭防火墙 

``` shell
防火墙相关

启动： 
systemctl start firewalld

查看状态： 
systemctl status firewalld 

禁用，禁止开机启动： 
systemctl disable firewalld

停止运行： 
systemctl stop firewalld
```

###### 2-4、编辑-虚拟网络编辑器内 NAT 设置子网ip 和网关

(网关为windows ipv4 默认网关例如 192.168.2.1，子网ip 192.168.2.0 必须和网关在同一网段，2 为网段)。

###### 2-5、虚拟机无法ping 通主机ip，但是可以ping 通网关
参考文章：https://blog.csdn.net/sinat_25306771/article/details/52761926

###### 2-6、网络已通，ssh无法连接服务器 ？

>1、vmnet8 使用动态分配的ip 与虚拟机ip 不在同一网段导致ssh 不能连接。； 
>2、和配置文件的MAC地址不匹配，这个也好解决，使用ip addr（或ifconfig）查看mac地址；
>3、查看 NAT 模式下是否勾选将主机虚拟适配器连接到此网络。windows vmnet8 设置：
![](./pic-1569376149666.png "pic-1569376149666.png")参考：<https://www.jianshu.com/p/ee44f0cd7743>

##### 三、如何为linux 换镜像仓库，yum安装找不到镜像仓库？ 设置镜像仓库

参考：<https://blog.csdn.net/inslow/article/details/54177191>

##### 四、yum 安装mysql 不成功镜像仓库导致。。建议官网下载压缩包解压安装。

参考：<http://orchome.com/238><https://blog.csdn.net/pengzhenjie36/article/details/75053059>

##### 五、RPM 包安装方式的MySQL卸载

参考：<https://www.jianshu.com/p/7b8c4dea6829>

##### 六、更新yum 源（使用yum 下载安装软件，yum 仓库使用源一定要配置好）

参考：<https://blog.csdn.net/u013850277/article/details/79240695>