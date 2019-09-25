---
title: Spring-1--什么是Spring？
Author: pengguozhen
CreateTime: 2018-3-20
categories:
- Spring
tags:
- Spring
---
[toc]

### 1、什么是 Spring？

 - Spring 是一个 IOC(DI) 和 AOP 容器框架，开源框架。
 - 轻量级：Spring 是非侵入性的 - 基于 Spring 开发的应用中的对象可以不依赖于 Spring 的 API。
 - 依赖注入(DI --- dependency injection、IOC)。
 - 面向切面编程(AOP --- aspect oriented programming)。
 - 容器: Spring 是一个容器, 因为它包含并且管理应用对象的生命周期。
 - 框架: Spring 实现了使用简单的组件配置组合成一个复杂的应用. 在 Spring 中可以使用 XML 和 Java 注解组合这些对象。
 - 一站式：在 IOC 和 AOP 的基础上可以整合各种企业应用的开源框架和优秀的第三方类库 （实际上 Spring 自身也提供了展现层的 SpringMVC 和 持久层的 Spring JDBC）。


----------
### 2、如何学好 Spring？

 - Spring核心是IoC容器，所以一定要透彻理解什么是IoC容器，以及如何配置及使用容器，其他所有技术都是基于容器实现的；
 - 理解好IoC后，接下来是面向切面编程，首先还是明确概念，基本配置，最后是实现原理。
 - 接下来就是数据库事务管理，其实Spring管理事务是通过面向切面编程实现的，所以基础很重要，IoC容器和面向切面编程搞定后，其余都是基于这俩东西的实现。


----------
### 3、Spring 基础
#### 3-1、Spring 架构图
![Spring架构图](https://github.com/ppjuice/xiaoshujiangTC/raw/master/小书匠/1548130458018.png)


----------


#### 3-2、各架构模块介绍

 - **1、核心容器：包括Core、Beans、Context、EL模块。**
	 - **Core模块**：封装了框架依赖的最底层部分，包括资源访问、类型转换及一些常用工具类。
	 - **Beans模块**：提供了框架的基础部分，包括反转控制和依赖注入。其中Bean Factory是容器核心，本质是“工厂设计模式”的实现，而且无需编程实现“单例设计模式”，单例完全由容器控制，而且提倡面向接口编程，而非面向实现编程；所有应用程序对象及对象间关系由框架管理，从而真正把你从程序逻辑中把维护对象之间的依赖关系提取出来，所有这些依赖关系都由BeanFactory来维护。
	 - **Context模块**：以Core和Beans为基础，集成Beans模块功能并添加资源绑定、数据验证、国际化、Java EE支持、容器生命周期、事件传播等；核心接口是ApplicationContext。
	 - **EL模块**：提供强大的表达式语言支持，支持访问和修改属性值，方法调用，支持访问及修改数组、容器和索引器，命名变量，支持算数和逻辑运算，支持从Spring 容器获取Bean，它也支持列表投影、选择和一般的列表聚合等。


----------


- **2、AOP、Aspects模块**
	- **AOP模块**：Spring AOP模块提供了符合 AOP Alliance规范的面向方面的编程（aspect-oriented programming）实现，提供比如日志记录、权限控制、性能统计等通用功能和业务逻辑分离的技术，并且能动态的把这些功能添加到需要的代码中；这样各专其职，降低业务逻辑和通用功能的耦合。
	- **Aspects模块**：提供了对AspectJ的集成，AspectJ提供了比Spring ASP更强大的功能。
数据访问/集成模块：该模块包括了JDBC、ORM、OXM、JMS和事务管理。


----------

- **3、data access/intergration 数据访问、数据整合模块**
	- **事务模块**：该模块用于Spring管理事务，只要是Spring管理对象都能得到Spring管理事务的好处，无需在代码中进行事务控制了，而且支持编程和声明性的事物管理。
	- **JDBC模块**：提供了一个JBDC的样例模板，使用这些模板能消除传统冗长的JDBC编码还有必须的事务控制，而且能享受到Spring管理事务的好处。
	- **ORM模块**：提供与流行的“对象-关系”映射框架的无缝集成，包括Hibernate、JPA、Ibatiss等。而且可以使用Spring事务管理，无需额外控制事务。
	- **OXM模块**：提供了一个对Object/XML映射实现，将java对象映射成XML数据，或者将XML数据映射成java对象，Object/XML映射实现包括JAXB、Castor、XMLBeans和XStream。
	- **JMS模块**：用于JMS(Java Messaging Service)，提供一套 “消息生产者、消息消费者”模板用于更加简单的使用JMS，JMS用于用于在两个应用程序之间，或分布式系统中发送消息，进行异步通信。


----------

- **4、Web 模块**
	- **Web/Remoting模块**：Web/Remoting模块包含了Web、Web-Servlet、Web-Struts、Web-Porlet模块。
	- **Web模块**：提供了基础的web功能。例如多文件上传、集成IoC容器、远程过程访问（RMI、Hessian、Burlap）以及Web Service支持，并提供一个RestTemplate类来提供方便的Restful services访问。
	- **Web-Servlet模块**：提供了一个Spring MVC Web框架实现。Spring MVC框架提供了基于注解的请求资源注入、更简单的数据绑定、数据验证等及一套非常易用的JSP标签，完全无缝与Spring其他技术协作。
	- **Web-Struts模块**：提供了与Struts无缝集成，Struts1.x 和Struts2.x都支持。
	- **Test模块**： Spring支持Junit和TestNG测试框架，而且还额外提供了一些基于Spring的测试功能，比如在测试Web框架时，模拟Http请求的功能。