---
title: Spring-2--开发环境搭建
Author: pengguozhen
CreateTime: 2018-3-20
categories:
- Spring
tags:
- Spring
---
[toc]

### 1、Spring 框架的核心jar 包
![Spring框架jar 包](https://github.com/ppjuice/xiaoshujiangTC/raw/master/小书匠/1548137955928.png)
除此之外，还有其他一些 jar 包。

----------
### 2、Spring 的 HelloWorld

 - 1、引入jar 包
 - 2、编写 com.ppjuice.helloworld.HelloWorld 类

``` java
package com.ppjuice.helloworld;

public class HelloWorld {

    private String username;

    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * 成员方法
     */
    public void hello() {
        System.out.println("This is hello....");
    }

    /**
     * 空参构造器
     */
    public HelloWorld() {
        // TODO Auto-generated constructor stub
    }
}
```
- 3、配置 ApplicationContext .xml 文件

