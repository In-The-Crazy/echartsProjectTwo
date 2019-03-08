/**   
* @company 南京红苹果科技有限公司
* @项目名称: travel_sms
* @Title: RedisUtil.java 
* @Package com.huicent.travel.util 
* @Description: TODO(用一句话描述该文件做什么) 
* @author 杨祖彧   
* @date 2018年1月12日 上午10:12:44 
* @version V3.0   
*/
package com.huicent.travel.util;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public class RedisUtil {
	//Redis服务器IP
	private static String ADDR = "";

	//Redis的端口号
	private static int PORT = 6379;

	//访问密码
	private static String AUTH = "redis.huicent@)";

	//可用连接实例的最大数目，默认值为8；
	//如果赋值为-1，则表示不限制；如果pool已经分配了maxActive个jedis实例，则此时pool的状态为exhausted(耗尽)。
//	private static int MAX_ACTIVE = 1024;
	private static int MAX_ACTIVE = -1;

	//控制一个pool最多有多少个状态为idle(空闲的)的jedis实例，默认值也是8。
	private static int MAX_IDLE = 200;

	//等待可用连接的最大时间，单位毫秒，默认值为-1，表示永不超时。如果超过等待时间，则直接抛出JedisConnectionException；
	private static long MAX_WAIT = 3000;
//	private static long MAX_WAIT = 10000;

	private static int TIMEOUT = 10000;

	//在borrow一个jedis实例时，是否提前进行validate操作；如果为true，则得到的jedis实例均是可用的；
	private static boolean TEST_ON_BORROW = true;

	private static JedisPool jedisPool = null;

	/**
	 * 初始化Redis连接池
	 */
	static {
		 try {
	 		 JedisPoolConfig config = new JedisPoolConfig();
			 config.setMaxActive(MAX_ACTIVE);
			 config.setMaxIdle(MAX_IDLE);
			 config.setMaxWait(MAX_WAIT);
			 config.setTestOnBorrow(TEST_ON_BORROW);
/*
			 System.out.println("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"+Config.getProperty("REDIS_ADDR"));
*/
			 //ADDR = Config.getProperty("REDIS_ADDR");
			 ADDR = "139.224.224.38";
			 jedisPool = new JedisPool(config, ADDR, PORT, TIMEOUT, AUTH);
			 //jedisPool = new JedisPool(config, ADDR);
			 } catch (Exception e) {
				e.printStackTrace();
			 }
		 }

	/**
	 * 获取Jedis实例
     * @return
     */
	public synchronized static Jedis getJedis() {
			if (jedisPool != null) {
				Jedis resource = jedisPool.getResource();
				return resource;
			} else {
				return null;
			}
		}

	/**
	 * 释放jedis资源
	 * @param jedis
	 */
	public static void returnResource(final Jedis jedis) {
		if (jedis != null) {
			jedisPool.returnResource(jedis);
			}
		}
	public static void returnpoor(Jedis jedis){
		jedisPool.returnBrokenResource(jedis);
	}
}