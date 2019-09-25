---
title: Spring-3--IOC&DI
Author: pengguozhen
CreateTime: 2018-3-20
categories:
- Spring
tags:
- Spring
---
[toc]

### 1、IOC&DI 概述
#### 1-1、IOC-控制反转
IOC(Inversion of Control)：其思想是反转资源获取的方向. 传统的资源查找方式要求组件向容器发起请求查找资源. 作为回应, 容器适时的返回资源. 而应用了 IOC 之后, 则是容器主动地将资源推送给它所管理的组件, 组件所要做的仅是选择一种合适的方式来接受资源. 这种行为也被称为查找的被动形式。


----------


#### 1-2、DI-依赖注入
DI(Dependency Injection) — IOC 的另一种表述方式：即组件以一些预先定义好的方式(例如: setter 方法)接受来自如容器的资源注入. 相对于 IOC 而言，这种表述更直接。


----------


#### 1-3、在 Spring IOC 容器中配置 Bean
* 1、在 Spring IOC 容器读取 Bean 配置创建 Bean 实例之前, 必须对它进行实例化. 只有在容器实例化后, 才可以从 IOC 容器里获取 Bean 实例并使用。
* 2、Spring 提供了两种类型的 IOC 容器实现。
    * BeanFactory: IOC 容器的基本实现：

	- ApplicationContext: 提供了更多的高级特性. 是 BeanFactory 的子接口。



----------


    

### 2、配置 Bean
#### 2-1、配置形式
* **基于 XML 文件的配置方式**
* 基于注解的方式（实际开发中主要使用该方式）


----------


#### 2-2、Bean 的配置方式
* **通过全类名（反射）**
* 通过工厂方法（静态工厂方法&实例工厂方法）
* FactoryBean


----------


#### 2-3、IOC 容器 BeanFactory & ApplicationContext 概述
- BeanFactory 是 Spring 框架的基础设施，面向 Spring 本身；ApplicationContext 面向使用 Spring 框架的开发者，几乎所有的应用场合都直接使用 ApplicationContext 而非底层的 BeanFactory
- ApplicationContext 接口

![ApplicationContext 类图](https://i.loli.net/2019/03/25/5c98a73020db2.jpg)

``` vim
ApplicationContext 的主要实现类：
	ClassPathXmlApplicationContext：从 类路径下加载配置文件
	FileSystemXmlApplicationContext: 从文件系统中加载配置文件
	
ConfigurableApplicationContext 扩展于 ApplicationContext，新增加两个主要方法：refresh() 和 close()， 让 ApplicationContext 具有启动、刷新和关闭上下文的能力。

ApplicationContext 在初始化上下文时就实例化所有单例的 Bean。

WebApplicationContext 是专门为 WEB 应用而准备的，它允许从相对于 WEB 根目录的路径中完成初始化工作。
```
从容器中 获取 Bean

![getBean()方法](https://i.loli.net/2019/03/25/5c98a730f067c.jpg)

----------


#### 2-4、依赖注入的方式
* 属性注入（注入细节）
  * 字面值
  * 引用其他 Bean
  * 内部Bean
  * 注入参数：（null 值和级联属性）
  * 集合属性& utility scheme 定义集合
  * 使用 P 命名空间
* 构造器注入
* 泛型依赖注入

1、Beans 
com.atguigu.spring.helloworld.HelloWorld
com.atguigu.spring.ref.Dao
com.atguigu.spring.ref.Service

``` java
package com.atguigu.spring.helloworld;

public class HelloWorld {

	private String user;

	public HelloWorld() {
		System.out.println("HelloWorld's constructor...");
	}

	public HelloWorld(String user) {
		this.user = user;
	}

	public void setUser(String user) {
		System.out.println("setUser:" + user);
		this.user = user;
	}

	public void hello(){
		System.out.println("Hello: " + user);
	}
	
}

package com.atguigu.spring.ref;

public class Dao {

	private String dataSource = "dbcp";
	
	public void setDataSource(String dataSource) {
		this.dataSource = dataSource;
	}
	
	public void save(){
		System.out.println("save by " + dataSource);
	}
	
	public Dao() {
		System.out.println("Dao's Constructor...");
	}
	
	public String toString(){
		return "[dataSource]:"+dataSource;
	}
	
}

package com.atguigu.spring.ref;

public class Service {

	private Dao dao;
	
	public void setDao(Dao dao) {
		this.dao = dao;
	}
	
	public Dao getDao() {
		return dao;
	}
	
	public void save(){
		System.out.println("Service's save");
		dao.save();
	}
	
}


```
2、Spring xml配置Beans

``` xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:util="http://www.springframework.org/schema/util"
       xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util-4.0.xsd">

    <!-- 1、属性注入：配置一个 bean 通过 setter 方法 为属性赋值 -->
    <bean id="helloWorld1" class="com.atguigu.spring.helloworld.HelloWorld">
        <property name="user" value="Jerry"/><!-- 为属性赋值 -->
    </bean>


    <!-- 2、构造器注入：通过构造器注入属性值 -->
    <bean id="helloWorld3" class="com.atguigu.spring.helloworld.HelloWorld">
        <constructor-arg value="Mike"/><!-- 要求: 在 Bean 中必须有对应的构造器.  -->
    </bean>

    <!-- 2-1、若一个 bean 有多个构造器, 如何通过构造器来为 bean 的属性赋值 -->
    <!-- 可以根据 index 和 value 进行更加精确的定位. (了解) -->
    <bean id="car" class="com.atguigu.spring.helloworld.Car">
        <constructor-arg value="KUGA" index="1"/>
        <constructor-arg value="ChangAnFord" index="0"/>
        <constructor-arg value="250000" type="float"/>
    </bean>

    <!--3、属性注入细节：字面值-->
    <bean id="car2" class="com.atguigu.spring.helloworld.Car">
        <constructor-arg value="ChangAnMazda"/>
        <constructor-arg>
            <value><![CDATA[<ATARZA>]]></value><!-- 若字面值中包含特殊字符, 则可以使用 CDATA 来进行赋值. (了解) -->
        </constructor-arg>
        <constructor-arg value="180" type="int"/>
    </bean>

    <!-- 4、属性注入细节：引用其他 bean 配置 -->
    <bean id="dao5" class="com.atguigu.spring.ref.Dao"/>

    <bean id="service" class="com.atguigu.spring.ref.Service">
        <property name="dao" ref="dao5"/><!-- 通过 ref 属性值指定当前属性指向哪一个 bean! -->
    </bean>

    <!-- 5、属性注入细节：声明使用内部 bean -->
    <bean id="service2" class="com.atguigu.spring.ref.Service">
        <property name="dao">
            <bean class="com.atguigu.spring.ref.Dao"><!-- 内部 bean, 类似于匿名内部类对象. 不能被外部的 bean 来引用, 也没有必要设置 id 属性 -->
                <property name="dataSource" value="c3p0"/>
            </bean>
        </property>
    </bean>

    <!--6、属性注入细节：注入参数之级联属性-->
    <bean id="action" class="com.atguigu.spring.ref.Action">
        <property name="service" ref="service2"/>
        <property name="service.dao.dataSource" value="DBCP2"/><!-- 设置级联属性(了解) -->
    </bean>

    <bean id="dao2" class="com.atguigu.spring.ref.Dao">
        <property name="dataSource">
            <null/>
        </property><!-- 为 Dao 的 dataSource 属性赋值为 null, 若某一个 bean 的属性值不是 null, 使用时需要为其设置为 null(了解) -->
    </bean>

    <!-- 7、属性注入细节：装配集合属性 -->
    <bean id="user" class="com.atguigu.spring.helloworld.User">
        <property name="userName" value="Jack"/>
        <property name="cars">
            <list><!-- 使用 list 元素来装配集合属性 -->
                <ref bean="car"/>
                <ref bean="car2"/>
            </list>
        </property>
    </bean>

    <!-- 7-1、声明集合类型的 bean -->
    <util:list id="cars">
        <ref bean="car"/>
        <ref bean="car2"/>
    </util:list>

    <!--7-2、引用外部声明的集合-->
    <bean id="user2" class="com.atguigu.spring.helloworld.User">
        <property name="userName" value="Rose"/>
        <property name="cars" ref="cars"/><!-- 引用外部声明的 list -->
    </bean>


    <!--8、属性注入细节：定义 P 命名空间-->
    <bean id="user3" class="com.atguigu.spring.helloworld.User"
          p:cars-ref="cars" p:userName="Titannic"/>

    <!--
         bean 的配置能够继承吗 ? 使用 parent 来完成继承
    -->
    <bean id="user4" parent="user" p:userName="Bob"/>

    <bean id="user6" parent="user" p:userName="维多利亚"/>

    <!-- 测试 depents-on -->
    <bean id="user5" parent="user" p:userName="Backham" depends-on="user6"/>

</beans>
```
3、测试 Main 

``` java
package com.atguigu.spring.helloworld;

import com.atguigu.spring.ref.*;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
	
	public static void main(String[] args) {

		/*测试未使用Spring 前对象的实例化操作*/
		HelloWorld helloWorld = new HelloWorld();
		helloWorld.setUser("Tom");
		helloWorld.hello();

		/* 测试使用 Spring 容器 后 对象实例化的操作*/
		ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("beans.xml");//创建 Spring 的 IOC 容器

		//1、测试 通过 setter 方法注入属性值
		HelloWorld helloWorld1= (HelloWorld) ctx.getBean("helloWorld1");
		helloWorld1.hello();

		//根据类型来获取 bean 的实例: 要求在  IOC 容器中只有一个与之类型匹配的 bean, 若有多个则会抛出异常.
		// 一般情况下, 该方法可用, 因为一般情况下, 在一个 IOC 容器中一个类型对应的 bean 也只有一个.
		//HelloWorld helloWorld1 = ctx.getBean(HelloWorld.class);

		// 2、测试通过构造器为属性赋值
		HelloWorld helloWorld3 = (HelloWorld)ctx.getBean("helloWorld3");
		helloWorld3.hello();

		/* 2-1、测试 bean 有多个构造器, 如何通过构造器来为 bean 的属性赋值*/
		Car car = (Car) ctx.getBean("car");
		System.out.println(car);//Car [company=ChangAnFord, brand=KUGA, maxSpeed=0, price=250000.0]

		/*3、属性注入细节：字面值*/
		Car car2= (Car) ctx.getBean("car2");
		System.out.println(car2);//Car [company=ChangAnMazda, brand=<ATARZA>, maxSpeed=180, price=0.0]

		//4. 属性注入细节：引用其他 Bean+级联属性设置
		Service service2= (Service) ctx.getBean("service2");
		System.out.print("service2:"+service2.getDao().toString());//由于级联属性的设置，输出结果为：[dataSource]:DBCP2

		//7、属性注入细节：装配集合属性


	}
	
}
```


----------


#### 2-5、自动装配
* XML 配置里的 Bean 自动装配。
* XML 配置里的 Bean 自动装配的缺点。

``` xml
<!-- 1、自动装配: 只声明 bean, 而把 bean 之间的关系交给 IOC 容器来完成 -->
	<!--  
		byType: 根据类型进行自动装配. 但要求 IOC 容器中只有一个类型对应的 bean, 若有多个则无法完成自动装配.
		byName: 若属性名和某一个 bean 的 id 名一致, 即可完成自动装配. 若没有 id 一致的, 则无法完成自动装配
	-->
	<!-- 在使用 XML 配置时, 自动装配用的不多. 但在基于 注解 的配置时, 自动装配使用的较多.  -->
	<bean id="dao" class="com.atguigu.spring.ref.Dao">
		<property name="dataSource" value="C3P0"></property>				
	</bean>
```

注：实际项目中很少使用xml方式的自动装配，在基于 注解 的配置时, 自动装配使用的较多，此处XML 配置方式的自动装配仅做了解。


----------


#### 2-6、Bean 之间的关系
* 继承

``` armasm
Spring 允许继承 bean 的配置, 被继承的 bean 称为父 bean. 继承这个父 Bean 的 Bean 称为子 Bean
子 Bean 从父 Bean 中继承配置, 包括 Bean 的属性配置
子 Bean 也可以覆盖从父 Bean 继承过来的配置
父 Bean 可以作为配置模板, 也可以作为 Bean 实例. 若只想把父 Bean 作为模板, 可以设置 <bean> 的abstract 属性为 true, 这样 Spring 将不会实例化这个 Bean
并不是 <bean> 元素里的所有属性都会被继承. 比如: autowire, abstract 等.
也可以忽略父 Bean 的 class 属性, 让子 Bean 指定自己的类, 而共享相同的属性配置. 但此时 abstract 必须设为 true
```

* 依赖

``` armasm
Spring 允许用户通过 depends-on 属性设定 Bean 前置依赖的Bean，前置依赖的 Bean 会在本 Bean 实例化之前创建好
如果前置依赖于多个 Bean，则可以通过逗号，空格或的方式配置 Bean 的名称
```



----------


#### 2-7、Bean 的作用域
在 Spring 中, 可以在 <bean> 元素的 scope 属性里设置 Bean 的作用域。
* singleton & prototype

beans-auto.xml
``` xml
	<!-- 1、自动装配: 只声明 bean, 而把 bean 之间的关系交给 IOC 容器来完成 -->
	<!--  
		byType: 根据类型进行自动装配. 但要求 IOC 容器中只有一个类型对应的 bean, 若有多个则无法完成自动装配.
		byName: 若属性名和某一个 bean 的 id 名一致, 即可完成自动装配. 若没有 id 一致的, 则无法完成自动装配
	-->
	<!-- 在使用 XML 配置时, 自动装配用的不多. 但在基于 注解 的配置时, 自动装配使用的较多.  -->
	<bean id="dao" class="com.atguigu.spring.ref.Dao">
		<property name="dataSource" value="C3P0"></property>				
	</bean>
	
	<!-- 2、默认情况下 bean 是单例的! 即为 singleton-->
	<!-- 但有的时候, bean 就不能使单例的. 例如: Struts2 的 Action 就不是单例的! 可以通过 scope 属性来指定 bean 的作用域 -->
	<!--  
		prototype: 原型的. 每次调用 getBean 方法都会返回一个新的 bean. 且在第一次调用 getBean 方法时才创建实例
		singleton: 单例的. 每次调用 getBean 方法都会返回同一个 bean. 且在 IOC 容器初始化时即创建 bean 的实例. 默认值 
	-->
	<bean id="dao2" class="com.atguigu.spring.ref.Dao" scope="prototype"></bean>
	
	<bean id="service" class="com.atguigu.spring.ref.Service" autowire="byName"></bean>
	
	<bean id="action" class="com.atguigu.spring.ref.Action" autowire="byType"></bean>
```

测试 Main
	

``` java
ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("beans-auto.xml");
		
		
//测试 bean 的作用域
Dao dao1 = (Dao) ctx.getBean("dao2");
Dao dao2 = (Dao) ctx.getBean("dao2");

System.out.println(dao1 == dao2);//false 非单例 Bean

```

* WEB 环境作用域


----------


#### 2-8、使用外部属性文件
- 在配置文件里配置 Bean 时, 有时需要在 Bean 的配置里混入系统部署的细节信息(例如: 文件路径, 数据源配置信息等). 而这些部署细节实际上需要和 Bean 配置相分离。
- Spring 提供了一个 PropertyPlaceholderConfigurer 的 BeanFactory 后置处理器, 这个处理器允许用户将 Bean 配置的部分内容外移到属性文件中. 可以在 Bean 配置文件里使用形式为 ${var} 的变量, PropertyPlaceholderConfigurer 从属性文件里加载属性, 并使用这些属性来替换变量.
- Spring 还允许在属性文件中使用 ${propName}，以实现属性之间的相互引用。
- Spring 2.5 之后不要再配置 PropertyPlaceholderConfigurer 类，简化为：```<context:property-placeholder>```。


``` xml
<context:property-placeholder location="classpath:db.properties"/>

<!-- 配置数据源 -->
	<bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
		<property name="user" value="${jdbc.user}"></property>
		<property name="password" value="${jdbc.password}"></property>
		<property name="driverClass" value="${jdbc.driverClass}"></property>
		<property name="jdbcUrl" value="${jdbc.jdbcUrl}"></property>
		
		<property name="initialPoolSize" value="${jdbc.initPoolSize}"></property>
		<property name="maxPoolSize" value="${jdbc.maxPoolSize}"></property>
	</bean>
```
测试 Main

``` java

ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("beans-auto.xml");
//测试使用外部属性文件
DataSource dataSource = (DataSource) ctx.getBean("dataSource");
System.out.println(dataSource.getConnection());
```
		
----------


#### 2-9、SpEL（Spring 表达式语言）
* SpEL 简介
	- Spring 表达式语言（简称SpEL）：是一个支持运行时查询和操作对象图的强大的表达式语言。
	- 语法类似于 EL：SpEL 使用 #{…} 作为定界符，所有在大框号中的字符都将被认为是 SpEL。
	- SpEL 为 bean 的属性进行动态赋值提供了便利。
	- 通过 SpEL 可以实现：	
		- 通过 bean 的 id 对 bean 进行引用。
		- 调用方法以及引用对象中的属性。
		- 计算表达式的值。
		- 正则表达式的匹配。

* SpEL：字面量

![字面量的表示](https://i.loli.net/2019/03/25/5c98a7317c807.jpg)

* SpEL：引用 Bean、属性和方法

![引用 Bean、属性和方法](https://i.loli.net/2019/03/25/5c98a7323dc80.jpg)
* SpEL 支持的运算符号

![支持的运算符号1](https://i.loli.net/2019/03/25/5c98a732c825e.jpg)

![支持的运算符号2](https://i.loli.net/2019/03/25/5c98a73345bd7.jpg)

动态赋值
``` xml
<!-- 4、测试 SpEL: 可以为属性进行动态的赋值(了解) -->
	<bean id="girl" class="com.atguigu.spring.helloworld.User">
		<property name="userName" value="周迅"></property>
	</bean>
	
	<bean id="boy" class="com.atguigu.spring.helloworld.User" init-method="init" destroy-method="destroy"><!--User 类中定义了init、destroy方法-->
		<property name="userName" value="高胜远"></property>
		<property name="wifeName" value="#{girl.userName}"></property>
	</bean>
```
测试 main

``` java
ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("beans-auto.xml");
//测试 spEL
User boy = (User) ctx.getBean("boy");
System.out.println(boy.getUserName() + ":" + boy.getWifeName());
```

----------


#### 2-10、IOC 容器中 Bean 的生命周期

- 1、Spring 配置 Bean 的后置通知

``` xml
<!-- 5、配置 bean 后置处理器: 不需要配置 id 属性, IOC 容器会识别到他是一个 bean 后置处理器, 并调用其方法 -->
	<bean class="com.atguigu.spring.ref.MyBeanPostProcessor"></bean>
```
Bean

``` java
package com.atguigu.spring.ref;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;

import com.atguigu.spring.helloworld.User;

public class MyBeanPostProcessor implements BeanPostProcessor {

	//该方法在 init 方法之后被调用
	@Override
	public Object postProcessAfterInitialization(Object arg0, String arg1)
			throws BeansException {
		if(arg1.equals("boy")){
			System.out.println("postProcessAfterInitialization..." + arg0 + "," + arg1);
			User user = (User) arg0;
			user.setUserName("李大齐");
		}
		return arg0;
	}

	//该方法在 init 方法之前被调用
	//可以工作返回的对象来决定最终返回给 getBean 方法的对象是哪一个, 属性值是什么
	/**
	 * @param arg0: 实际要返回的对象
	 * @param arg1: bean 的 id 值
	 */
	@Override
	public Object postProcessBeforeInitialization(Object arg0, String arg1)
			throws BeansException {
		if(arg1.equals("boy"))
			System.out.println("postProcessBeforeInitialization..." + arg0 + "," + arg1);
		return arg0;
	}

}
```
测试 Main
``` java
ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("beans-auto.xml");
//测试 spEL
User boy = (User) ctx.getBean("boy");
System.out.println(boy.getUserName() + ":" + boy.getWifeName());
```

- 2、Spring IOC 容器对 Bean 的生命周期进行管理的过程:

``` armasm
通过构造器或工厂方法创建 Bean 实例。
为 Bean 的属性设置值和对其他 Bean 的引用。
将 Bean 实例传递给 Bean 后置处理器的 postProcessBeforeInitialization 方法。
调用 Bean 的初始化方法。
将 Bean 实例传递给 Bean 后置处理器的 postProcessAfterInitialization方法。
Bean 可以使用了。
当容器关闭时, 调用 Bean 的销毁方法。
```
- 3、工厂方法&FactroyBean 方式配置 Bean

beans-auto.xml
``` xml
<!-- 6、通过工厂方法的方式来配置 bean -->
	<!-- 6-1. 通过静态工厂方法: 一个类中有一个静态方法, 可以返回一个类的实例(了解) -->
	<!-- 在 class 中指定静态工厂方法的全类名, 在 factory-method 中指定静态工厂方法的方法名 -->
	<bean id="dateFormat" class="java.text.DateFormat" factory-method="getDateInstance">
		<constructor-arg value="2"></constructor-arg><!-- 可以通过 constructor-arg 子节点为静态工厂方法指定参数 -->
	</bean>
	
	<!-- 6-2. 实例工厂方法: 先需要创建工厂对象, 再调用工厂的非静态方法返回实例(了解) -->
	<!-- ①. 创建工厂对应的 bean -->
	<bean id="simpleDateFormat" class="java.text.SimpleDateFormat">
		<constructor-arg value="yyyy-MM-dd hh:mm:ss"></constructor-arg>
	</bean>
	
	<!-- ②. 有实例工厂方法来创建 bean 实例 -->
	<!-- factory-bean 指向工厂 bean, factory-method 指定工厂方法(了解) -->
	<bean id="datetime" factory-bean="simpleDateFormat" factory-method="parse">
		<!-- 通过 constructor-arg 执行调用工厂方法需要传入的参数 -->
		<constructor-arg value="1990-12-12 12:12:12"></constructor-arg>
	</bean>
	
	<!-- 7、配置通过 FactroyBean 的方式来创建 bean 的实例(了解) -->
	<bean id="user" class="com.atguigu.spring.ref.UserBean"></bean>
```
测试 Main

``` java
//测试工厂方法配置 Bean
//		DateFormat dateFormat = DateFormat.getDateInstance(DateFormat.FULL);
DateFormat dateFormat = (DateFormat) ctx.getBean("dateFormat");
System.out.println(dateFormat.format(new Date()));

Date date = (Date) ctx.getBean("datetime");
System.out.println(date);


//测试通过 FactroyBean 来配置 Bean
User user = (User) ctx.getBean("user");
System.out.println(user);

ctx.close();
```

----------

#### 2-11、Spring4.x 新特性 泛型依赖注入
![泛型依赖注入](https://i.loli.net/2019/03/25/5c98a7338adda.jpg)


----------

#### 2-12、整合多个配置文件
![整合多个配置文件](https://i.loli.net/2019/03/25/5c98a7340b6b6.jpg)


----------
