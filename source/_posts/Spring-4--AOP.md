---
title: Spring-4--AOP
Author: pengguozhen
CreateTime: 2018-3-20
categories:
- Spring
tags:
- Spring
---
[toc]


### 1、为什么需要 AOP？
需求案例：
需求1-日志：在程序执行期间追踪正在发生的活动。
需求2-验证：希望计算器只能处理正数的运算。

#### 1-1、不使用 AOP 时的代码实现。
![类图](https://i.loli.net/2019/03/25/5c98a77ff16eb.jpg)

![代码实现](https://i.loli.net/2019/03/25/5c98a78074ac0.jpg)

![问题分析](https://i.loli.net/2019/03/25/5c98a780e4843.jpg)


----------

#### 1-2、使用动态代理解决问题分析
**代理设计模式的原理：使用一个代理将对象包装起来, 然后用该代理对象取代原始对象. 任何对原始对象的调用都要通过代理. 代理对象决定是否以及何时将方法调用转到原始对象上。**
- 0、接口实现类

``` java
public class ArithmeticCalculatorImpl implements ArithmeticCalculator {

	@Override
	public int add(int i, int j) {
		int result = i + j;
		return result;
	}

	@Override
	public int sub(int i, int j) {
		int result = i - j;
		return result;
	}

	@Override
	public int mul(int i, int j) {
		int result = i * j;
		return result;
	}

	@Override
	public int div(int i, int j) {
		int result = i / j;
		return result;
	}
```


- 1、新建处理日志的代理类 ArithmeticCalculatorLoggingProxy，将原始对象包装起来。（**匿名内部类的方式实现**）

``` java
public class ArithmeticCalculatorLoggingProxy {
	
	//要代理的对象
	private ArithmeticCalculator target;
	
	public ArithmeticCalculatorLoggingProxy(ArithmeticCalculator target) {
		super();
		this.target = target;
	}

	//返回代理对象
	public ArithmeticCalculator getLoggingProxy(){
		ArithmeticCalculator proxy = null;
		
		ClassLoader loader = target.getClass().getClassLoader();
		Class [] interfaces = new Class[]{ArithmeticCalculator.class};
		InvocationHandler h = new InvocationHandler() {
			/**
			 * proxy: 代理对象。 一般不使用该对象
			 * method: 正在被调用的方法
			 * args: 调用方法传入的参数
			 */
			@Override
			public Object invoke(Object proxy, Method method, Object[] args)
					throws Throwable {
				String methodName = method.getName();
				//打印日志
				System.out.println("[before] The method " + methodName + " begins with " + Arrays.asList(args));
				
				//调用目标方法
				Object result = null;
				
				try {
					//前置通知
					result = method.invoke(target, args);
					//返回通知, 可以访问到方法的返回值
				} catch (NullPointerException e) {
					e.printStackTrace();
					//异常通知, 可以访问到方法出现的异常
				}
				
				//后置通知. 因为方法可以能会出异常, 所以访问不到方法的返回值
				
				//打印日志
				System.out.println("[after] The method ends with " + result);
				
				return result;
			}
		};
		
		/**
		 * loader: 代理对象使用的类加载器。 
		 * interfaces: 指定代理对象的类型. 即代理代理对象中可以有哪些方法. 
		 * h: 当具体调用代理对象的方法时, 应该如何进行响应, 实际上就是调用 InvocationHandler 的 invoke 方法
		 */
		proxy = (ArithmeticCalculator) Proxy.newProxyInstance(loader, interfaces, h);
		
		return proxy;
	}
}
```
（**实现 InvocationHandler 接口的方式实现（推荐）**）

``` java
/**
 * 动态代理类的实现：InvocationHandler接口（invoke方法）+Proxy类（newProxyInstance方法）
 */
public class ArithmeticCalculatorLoggingProxy implements InvocationHandler {

    //要代理的对象
    private ArithmeticCalculator target;

    public ArithmeticCalculatorLoggingProxy(ArithmeticCalculator target) {
//		super();
        this.target = target;
    }

    //返回代理对象
    public ArithmeticCalculator getLoggingProxy() {
        ArithmeticCalculator proxy = null;
        ClassLoader loader = target.getClass().getClassLoader();
        Class[] interfaces = new Class[]{ArithmeticCalculator.class};//

         /**
         * Proxy 类：
         * loader: 代理对象使用的类加载器。
         * interfaces: 指定被代理对象的一组接口. 即被代理对象实现了哪些接口。指定后该代理对象实例就会实现被代理对象接口的所有方法。
         * h: 当具体调用代理对象的方法时, 应该如何进行响应, 实际上就是调用 InvocationHandler 的 invoke 方法
         */
        proxy = (ArithmeticCalculator) Proxy.newProxyInstance(loader, interfaces, new ArithmeticCalculatorLoggingProxy(target));//h:参数，该类实现了此接口有继承关系。

System.out.println("代理对象实例："+proxy.getClass().getName());//代理对象实例

        return proxy;
    }


    /**
     * proxy: 代理对象。 一般不使用该对象
     * method: 正在被调用的方法
     * args: 调用方法传入的参数
     */
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        String methodName = method.getName();
        //打印日志
        System.out.println("[before] The method " + methodName + " begins with " + Arrays.asList(args));

        //调用目标方法
        Object result = null;

        try {
            //前置通知
            result = method.invoke(target, args);//返回通知, 可以访问到方法的返回值
        } catch (NullPointerException e) {
            e.printStackTrace();//异常通知, 可以访问到方法出现的异常
        }

        //后置通知. 因为方法可以能会出异常, 所以访问不到方法的返回值
        //打印日志
        System.out.println("[after] The method ends with " + result);

        return result;
    }
```

#### 1-3、动态代理原理分析
- 1、Java 动态代理创建出来的动态代理类。
**上面我们利用Proxy类的newProxyInstance方法创建了一个动态代理对象，查看该方法的源码，发现它只是封装了创建动态代理类的步骤(红色标准部分)：**

``` java
public static Object newProxyInstance(ClassLoader loader,
                                          Class<?>[] interfaces,
                                          InvocationHandler h)
        throws IllegalArgumentException
    {
        Objects.requireNonNull(h);

        final Class<?>[] intfs = interfaces.clone();
        final SecurityManager sm = System.getSecurityManager();
        if (sm != null) {
            checkProxyAccess(Reflection.getCallerClass(), loader, intfs);
        }

        /*
         * Look up or generate the designated proxy class.
         */
        Class<?> cl = getProxyClass0(loader, intfs);

        /*
         * Invoke its constructor with the designated invocation handler.
         */
        try {
            if (sm != null) {
                checkNewProxyPermission(Reflection.getCallerClass(), cl);
            }

            final Constructor<?> cons = cl.getConstructor(constructorParams);
            final InvocationHandler ih = h;
            if (!Modifier.isPublic(cl.getModifiers())) {
                AccessController.doPrivileged(new PrivilegedAction<Void>() {
                    public Void run() {
                        cons.setAccessible(true);
                        return null;
                    }
                });
            }
            return cons.newInstance(new Object[]{h});
        } catch (IllegalAccessException|InstantiationException e) {
            throw new InternalError(e.toString(), e);
        } catch (InvocationTargetException e) {
            Throwable t = e.getCause();
            if (t instanceof RuntimeException) {
                throw (RuntimeException) t;
            } else {
                throw new InternalError(t.toString(), t);
            }
        } catch (NoSuchMethodException e) {
            throw new InternalError(e.toString(), e);
        }
    }
```

其实，我们最应该关注的是 Class<?> cl = getProxyClass0(loader, intfs);这句，这里产生了代理类，后面代码中的构造器也是通过这里产生的类来获得，可以看出，这个类的产生就是整个动态代理的关键，由于是动态生成的类文件，我这里不具体进入分析如何产生的这个类文件，只需要知道这个类文件时缓存在java虚拟机中的，我们可以通过下面的方法将其打印到文件里面，一睹真容：

``` java
 private void generateProxyClass() {
        byte[] classFile = ProxyGenerator.generateProxyClass("$Proxy4", ArithmeticCalculatorImpl.class.getInterfaces());
        String path = "E:\\PersonWorkSpace\\JavaEESpace\\spring-2\\src\\com\\atguigu\\spring\\dynamicProxy\\ArithmeticCalculatorImpl.class";
        try(FileOutputStream fos = new FileOutputStream(path)) {
            fos.write(classFile);
            fos.flush();
            System.out.println("代理类class文件写入成功");
        } catch (Exception e) {
            System.out.println("写文件错误");
        }
    }
```
对这个class文件进行反编译，我们看看jdk为我们生成了什么样的内容：
**生成的代理类 实现了被代理类的接口。代理类调用接口方法时，会利用反射转发到invoke 去调用方法。**

``` java
public final class $Proxy4 extends Proxy implements ArithmeticCalculator {
    private static Method m1;
    private static Method m2;
    private static Method m6;
    private static Method m3;
    private static Method m5;
    private static Method m4;
    private static Method m0;

    public $Proxy4(InvocationHandler var1) throws  {
        super(var1);
    }

    public final boolean equals(Object var1) throws  {
        try {
            return (Boolean)super.h.invoke(this, m1, new Object[]{var1});
        } catch (RuntimeException | Error var3) {
            throw var3;
        } catch (Throwable var4) {
            throw new UndeclaredThrowableException(var4);
        }
    }

    public final String toString() throws  {
        try {
            return (String)super.h.invoke(this, m2, (Object[])null);
        } catch (RuntimeException | Error var2) {
            throw var2;
        } catch (Throwable var3) {
            throw new UndeclaredThrowableException(var3);
        }
    }

    public final int mul(int var1, int var2) throws  {
        try {
            return (Integer)super.h.invoke(this, m6, new Object[]{var1, var2});
        } catch (RuntimeException | Error var4) {
            throw var4;
        } catch (Throwable var5) {
            throw new UndeclaredThrowableException(var5);
        }
    }

    public final int add(int var1, int var2) throws  {
        try {
            return (Integer)super.h.invoke(this, m3, new Object[]{var1, var2});//该代理类调用方法时转发到 invoke 方法反射调用。
        } catch (RuntimeException | Error var4) {
            throw var4;
        } catch (Throwable var5) {
            throw new UndeclaredThrowableException(var5);
        }
    }

    public final int sub(int var1, int var2) throws  {
        try {
            return (Integer)super.h.invoke(this, m5, new Object[]{var1, var2});
        } catch (RuntimeException | Error var4) {
            throw var4;
        } catch (Throwable var5) {
            throw new UndeclaredThrowableException(var5);
        }
    }

    public final int div(int var1, int var2) throws  {
        try {
            return (Integer)super.h.invoke(this, m4, new Object[]{var1, var2});
        } catch (RuntimeException | Error var4) {
            throw var4;
        } catch (Throwable var5) {
            throw new UndeclaredThrowableException(var5);
        }
    }

    public final int hashCode() throws  {
        try {
            return (Integer)super.h.invoke(this, m0, (Object[])null);
        } catch (RuntimeException | Error var2) {
            throw var2;
        } catch (Throwable var3) {
            throw new UndeclaredThrowableException(var3);
        }
    }

    static {
        try {
            m1 = Class.forName("java.lang.Object").getMethod("equals", Class.forName("java.lang.Object"));
            m2 = Class.forName("java.lang.Object").getMethod("toString");
            m6 = Class.forName("com.atguigu.spring.dynamicProxy.ArithmeticCalculator").getMethod("mul", Integer.TYPE, Integer.TYPE);
            m3 = Class.forName("com.atguigu.spring.dynamicProxy.ArithmeticCalculator").getMethod("add", Integer.TYPE, Integer.TYPE);
            m5 = Class.forName("com.atguigu.spring.dynamicProxy.ArithmeticCalculator").getMethod("sub", Integer.TYPE, Integer.TYPE);
            m4 = Class.forName("com.atguigu.spring.dynamicProxy.ArithmeticCalculator").getMethod("div", Integer.TYPE, Integer.TYPE);
            m0 = Class.forName("java.lang.Object").getMethod("hashCode");
        } catch (NoSuchMethodException var2) {
            throw new NoSuchMethodError(var2.getMessage());
        } catch (ClassNotFoundException var3) {
            throw new NoClassDefFoundError(var3.getMessage());
        }
    }
}
```



参考博客：
https://www.cnblogs.com/gonjan-blog/p/6685611.html。
http://www.cnblogs.com/xiaoluo501395377/p/3383130.html。


----------


#### 1-4、总结
生成的代理类：$Proxy0 extends Proxy implements Person，我们看到代理类继承了Proxy类，所以也就决定了java动态代理只能对接口进行代理，Java的继承机制注定了这些动态代理类们无法实现对class的动态代理。
上面的动态代理的例子，其实就是AOP的一个简单实现了，在目标对象的方法执行之前和执行之后进行了处理，对方法耗时统计。Spring的AOP实现其实也是用了Proxy和InvocationHandler这两个东西的。


----------


----------


### 2、AOP 简介
- 1、AOP(Aspect-Oriented Programming, 面向切面编程)。
- 2、AOP 的主要编程对象是切面(aspect), 而切面模块化横切关注点。
- 3、在应用 AOP 编程时, 仍然需要定义公共功能, 但可以明确的定义这个功能在哪里, 以什么方式应用, 并且不必修改受影响的类. 这样一来横切关注点就被模块化到特殊的对象(切面)里。
- 4、AOP 的好处:
每个事物逻辑位于一个位置, 代码不分散, 便于维护和升级
业务模块更简洁, 只包含核心业务代码


----------


----------


### 3、AOP 术语

#### 3-1、切面(Aspect)
切面就是横切面，代表的是一个普遍存在的共有功能。例如，日志、验证、统计成员方法运行时间。都可作为一个切面来处理。
例：代理对象$proxy0 已经将日志切面与业务逻辑add 方法进行了合成。（先调invoke 打印日志，再反射调用 add 方法。）

#### 3-2、通知 (Advice)
切面要完成的工作，例如：日志切面要完成打印日志的任务，则通知即是打印日志。前置通知在 add 方法反射执行前打印日志，后置通知在 add 方法反射执行后打印通知。
- 五种类型的通知注解
@Before: 前置通知, 在方法执行之前执行。
@After: 后置通知, 在方法执行之后执行 。
@AfterRunning: 返回通知, 在方法返回结果之后执行。
@AfterThrowing: 异常通知, 在方法抛出异常之后。
@Around: 环绕通知, 围绕着方法执行。


#### 3-3、目标 (Target)

#### 3-4、代理 (Proxy)
#### 3-5、连接点（Joinpoint）
程序执行的某个特定位置：如类某个方法调用前、调用后、方法抛出异常后等。
例如 ArithmethicCalculator#add()方法。

#### 3-6、切点（pointcut）
每个类都拥有多个连接点：例如 ArithmethicCalculator 的所有方法实际上都是连接点。
AOP 通过切点定位到特定的连接点。切点即指类和方法。AOP 使用类和方法作为连接点的查询条件。定位连接点。

----------


### 4、在Spring 中启用 AspectJ AOP框架。
- 1、要在 Spring 应用中使用 AspectJ 注解, 必须在 classpath 下包含 AspectJ 类库: aopalliance.jar、aspectj.weaver.jar 和 spring-aspects.jar
- 2、将 aop Schema 添加到 <beans> 根元素中.
- 3、要在 Spring IOC 容器中启用 AspectJ 注解支持, 只要在 Bean 配置文件中定义一个空的 XML 元素 &lt; aop:aspectj-autoproxy &gt;
- 4、当 Spring IOC 容器侦测到 Bean 配置文件中的 &lt; aop:aspectj-autoproxy&gt; 元素时, 会自动为与 AspectJ 切面匹配的 Bean 创建代理。


----------

#### 4-1、用 AspectJ 注解声明切面
- 1、要在 Spring 中声明 AspectJ 切面, 只需要在 IOC 容器中将切面声明为 Bean 实例. 当在 Spring IOC 容器中初始化 AspectJ 切面之后, Spring IOC 容器就会为那些与 AspectJ 切面相匹配的 Bean 创建代理.。
- 2、在 AspectJ 注解中, 切面只是一个带有 @Aspect 注解的 Java 类. 。
- 3、通知是标注有某种注解的简单的 Java 方法.。
- 4、AspectJ 支持 5 种类型的通知注解: 
@Before: 前置通知, 在方法执行之前执行。
@After: 后置通知, 在方法执行之后执行 。
@AfterRunning: 返回通知, 在方法返回结果之后执行。
@AfterThrowing: 异常通知, 在方法抛出异常之后。
@Around: 环绕通知, 围绕着方法执行。


----------

#### 4-2、前置通知
![前置通知](https://i.loli.net/2019/03/25/5c98a7815cf38.jpg)
**利用方法签名编写 AspectJ 切入点表达式**

![切点表达式](https://i.loli.net/2019/03/25/5c98a781c9ebc.jpg)

- 方法签名：方法签名由方法名称和一个参数列表（方法的参数的顺序和类型）组成；注意，方法签名不包括方法的返回类型。不包括返回值和访问修饰符
- 切点表达式：
- 合并切点表达式

![合并切点表达式](https://i.loli.net/2019/03/25/5c98a7821fc2d.jpg)

- 让通知访问当前连接点的细节

![通知访问连接点的细节](https://i.loli.net/2019/03/25/5c98a7826fdad.jpg)


----------


#### 4-3、后置通知
![后置通知](https://i.loli.net/2019/03/25/5c98a782bf959.jpg)


----------


#### 4-4、返回通知
![返回通知](https://i.loli.net/2019/03/25/5c98a7831bbab.jpg)

- 返回通知中访问连接点的返回值

![返回通知访问连接点的返回值](https://i.loli.net/2019/03/25/5c98a78370d6c.jpg)


----------


#### 4-5、异常通知
![异常通知](https://i.loli.net/2019/03/25/5c98aa1b58cb0.jpg)


----------


#### 4-6、环绕通知
![环绕通知](https://i.loli.net/2019/03/25/5c98aa1ba90c2.jpg)

![环绕通知示例](https://i.loli.net/2019/03/25/5c98aa1c0d2b4.jpg)


----------


#### 4-7、指定切面的优先级
![指定切面优先级](https://i.loli.net/2019/03/25/5c98aa1c577c7.jpg)


----------


#### 4-8、重用切入点定义
见 合并切入点

![重用切入点](https://i.loli.net/2019/03/25/5c98aa1ca8654.jpg)

![示例](https://i.loli.net/2019/03/25/5c98aa1d055aa.jpg)


----------

#### 4-9、引入通知
**引入通知是一种特殊的通知类型. 它通过为接口提供实现类, 允许对象动态地实现接口, 就像对象已经在运行时扩展了实现类一样**

#### 4-10、用XML 声明切面、切点、通知（包括引入通知）


----------

### 5、Spring 对JDBC 的支持

#### 5-1、Spring xml 中配置 JDBC 模板类和 c3p0 数据源
org.springframework.jdbc.core.JdbcTemplate

``` xml
<context:component-scan base-package="com.atguigu.spring"></context:component-scan>
	
	<!-- 导入资源文件 -->
	<context:property-placeholder location="classpath:db.properties"/>
	
	<!-- 配置 C3P0 数据源 -->
	<bean id="dataSource"
		class="com.mchange.v2.c3p0.ComboPooledDataSource">
		<property name="user" value="${jdbc.user}"></property>
		<property name="password" value="${jdbc.password}"></property>
		<property name="jdbcUrl" value="${jdbc.jdbcUrl}"></property>
		<property name="driverClass" value="${jdbc.driverClass}"></property>

		<property name="initialPoolSize" value="${jdbc.initPoolSize}"></property>
		<property name="maxPoolSize" value="${jdbc.maxPoolSize}"></property>
	</bean>
	
	<!-- 配置 Spirng 的 JdbcTemplate -->
	<bean id="jdbcTemplate" 
		class="org.springframework.jdbc.core.JdbcTemplate">
		<property name="dataSource" ref="dataSource"></property>
	</bean>
```

#### 5-2、jdbcTemplate 模板方法测试

``` java

public class JDBCTest {
	
	private ApplicationContext ctx = null;
	private JdbcTemplate jdbcTemplate;
	private EmployeeDao employeeDao;
	private DepartmentDao departmentDao;
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
	
	{
		ctx = new ClassPathXmlApplicationContext("applicationContext.xml");
		jdbcTemplate = (JdbcTemplate) ctx.getBean("jdbcTemplate");
		employeeDao = ctx.getBean(EmployeeDao.class);
		departmentDao = ctx.getBean(DepartmentDao.class);
		namedParameterJdbcTemplate = ctx.getBean(NamedParameterJdbcTemplate.class);
	}
	
/**
	 * 获取单个列的值, 或做统计查询
	 * 使用 queryForObject(String sql, Class<Long> requiredType) 
	 */
	@Test
	public void testQueryForObject2(){
		String sql = "SELECT count(id) FROM employees";
		long count = jdbcTemplate.queryForObject(sql, Long.class);
		
		System.out.println(count);
	}
	
	/**
	 * 查到实体类的集合
	 * 注意调用的不是 queryForList 方法
	 */
	@Test
	public void testQueryForList(){
		String sql = "SELECT id, last_name lastName, email FROM employees WHERE id > ?";
		RowMapper<Employee> rowMapper = new BeanPropertyRowMapper<>(Employee.class);
		List<Employee> employees = jdbcTemplate.query(sql, rowMapper,5);
		
		System.out.println(employees);
	}
	
	/**
	 * 从数据库中获取一条记录, 实际得到对应的一个对象
	 * 注意不是调用 queryForObject(String sql, Class<Employee> requiredType, Object... args) 方法!
	 * 而需要调用 queryForObject(String sql, RowMapper<Employee> rowMapper, Object... args)
	 * 1. 其中的 RowMapper 指定如何去映射结果集的行, 常用的实现类为 BeanPropertyRowMapper
	 * 2. 使用 SQL 中列的别名完成列名和类的属性名的映射. 例如 last_name lastName
	 * 3. 不支持级联属性. JdbcTemplate 到底是一个 JDBC 的小工具, 而不是 ORM 框架
	 */
	@Test
	public void testQueryForObject(){
		String sql = "SELECT id, last_name lastName, email, dept_id as \"department.id\" FROM employees WHERE id = ?";
		RowMapper<Employee> rowMapper = new BeanPropertyRowMapper<>(Employee.class);
		Employee employee = jdbcTemplate.queryForObject(sql, rowMapper, 1);
		
		System.out.println(employee);
	}
	
	/**
	 * 执行批量更新: 批量的 INSERT, UPDATE, DELETE
	 * 最后一个参数是 Object[] 的 List 类型: 因为修改一条记录需要一个 Object 的数组, 那么多条不就需要多个 Object 的数组吗
	 */
	@Test
	public void testBatchUpdate(){
		String sql = "INSERT INTO employees(last_name, email, dept_id) VALUES(?,?,?)";
		
		List<Object[]> batchArgs = new ArrayList<>();
		
		batchArgs.add(new Object[]{"AA", "aa@atguigu.com", 1});
		batchArgs.add(new Object[]{"BB", "bb@atguigu.com", 2});
		batchArgs.add(new Object[]{"CC", "cc@atguigu.com", 3});
		batchArgs.add(new Object[]{"DD", "dd@atguigu.com", 3});
		batchArgs.add(new Object[]{"EE", "ee@atguigu.com", 2});
		
		jdbcTemplate.batchUpdate(sql, batchArgs);
	}
	
	/**
	 * 执行 INSERT, UPDATE, DELETE
	 */
	@Test
	public void testUpdate(){
		String sql = "UPDATE employees SET last_name = ? WHERE id = ?";
		jdbcTemplate.update(sql, "Jack", 5);
	}
	
	@Test
	public void testDataSource() throws SQLException {
		DataSource dataSource = ctx.getBean(DataSource.class);
		System.out.println(dataSource.getConnection());
	}
	
	}
	
```

#### 5-3、NamedParameterJdbcTemplate 具名参数模板类。

``` xml
<!-- 配置 NamedParameterJdbcTemplate, 该对象可以使用具名参数, 其没有无参数的构造器, 所以必须为其构造器指定参数 -->
	<bean id="namedParameterJdbcTemplate"
		class="org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate">
		<constructor-arg ref="dataSource"></constructor-arg>	
	</bean>
```
**测试**

``` java
	/**
	 * 使用具名参数时, 可以使用 update(String sql, SqlParameterSource paramSource) 方法进行更新操作
	 * 1. SQL 语句中的参数名和类的属性一致!
	 * 2. 使用 SqlParameterSource 的 BeanPropertySqlParameterSource 实现类作为参数. 
	 */
	@Test
	public void testNamedParameterJdbcTemplate2(){
		String sql = "INSERT INTO employees(last_name, email, dept_id) "
				+ "VALUES(:lastName,:email,:dpetId)";
		
		Employee employee = new Employee();
		employee.setLastName("XYZ");
		employee.setEmail("xyz@sina.com");
		employee.setDpetId(3);
		
		SqlParameterSource paramSource = new BeanPropertySqlParameterSource(employee);
		namedParameterJdbcTemplate.update(sql, paramSource);
	}
	
	/**
	 * 可以为参数起名字. 
	 * 1. 好处: 若有多个参数, 则不用再去对应位置, 直接对应参数名, 便于维护
	 * 2. 缺点: 较为麻烦. 
	 */
	@Test
	public void testNamedParameterJdbcTemplate(){
		String sql = "INSERT INTO employees(last_name, email, dept_id) VALUES(:ln,:email,:deptid)";
		
		Map<String, Object> paramMap = new HashMap<>();
		paramMap.put("ln", "FF");
		paramMap.put("email", "ff@atguigu.com");
		paramMap.put("deptid", 2);
		
		namedParameterJdbcTemplate.update(sql, paramMap);
	}
```

----------


### 6、Spring 对事务的管理

#### 6-1、声明式事务
- 1、编程式事务管理
将事务管理代码嵌入到业务方法中来控制事务的提交和回滚。（正常方式）

-2、声明式事务管理
将事务管理代码从业务方法中分离出来, 以声明的方式来实现事务管理。Spring 通过 Spring AOP 框架支持声明式事务管理。通过使用注解+配置事务管理器。



----------


#### 6-2、事务的传播行为

#### 6-3、事务的隔离级别

----------


