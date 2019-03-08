/**
 * @company 南京红苹果科技有限公司
 * @项目名称: travel_sms
 * @Title: getCtrip.java
 * @Package com.huicent.common.util
 * @Description: TODO(用一句话描述该文件做什么)
 * @author 杨祖彧
 * @date 2019年1月22日 下午4:14:43
 * @version V3.0
 */
package com.huicent.common.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import redis.clients.jedis.Jedis;

import com.huicent.server.util.HcDateUtil;
import com.huicent.travel.util.RedisUtil;

/**
 * 映射TODO
 *
 * @ClassName: getCtrip
 * @author 杨祖彧
 * @date 2019年1月22日 下午4:14:43
 */
public class getCtrip {

	/**
	 *
	 *TODO(方法的作用/映射)查询多个航班
	 * @Title: getFight
	 * @param dcity
	 * @param acity
	 * @param fightDate
	 * @param minute
	 * @return
	 * 创建日期：2019年1月28日 上午10:36:04
	 * @author 杨祖彧
	 */
	public String getFight(String dcity, String acity, String fightDate, String minute) {
		String currentDate = HcDateUtil.getCurrentDate(HcDateUtil.yyyyMMdd10);
		Jedis jedis = null;
		jedis = RedisUtil.getJedis();
		String s = jedis.get(dcity + "-" + acity + fightDate);
		String[] ss = s.split(",");
		Map map = new HashMap();
		int min = 1;
		if("10".equals(minute)){
			min = 2;
		}else if("30".equals(minute)){
			min = 6;
		}else if("60".equals(minute)){
			min = 12;
		}
		for(int i = 0; i< ss.length;i++){
			Set<String> set = jedis.keys(ss[i] + dcity + "-" + acity + fightDate + currentDate + "*");
			List<String> list = new ArrayList<>(set);
			String[] keys = new String[set.size()];
			for(int k = 0;k< list.size();k++){
				keys[k] = list.get(k);
			}
			for (int x = 0; x < list.size() - 1; x++) {
				for (int y = x + 1; y < list.size(); y++) {
					int xl = Integer.parseInt(keys[x].substring(keys[x].indexOf(" ")+1, keys[x].indexOf(" ")+3) + keys[x].substring(keys[x].indexOf(" ")+4, keys[x].indexOf(" ")+6));
					int yl = Integer.parseInt(keys[y].substring(keys[y].indexOf(" ")+1, keys[y].indexOf(" ")+3) + keys[y].substring(keys[y].indexOf(" ")+4, keys[y].indexOf(" ")+6));
					if (xl > yl) {
						String temp = keys[x];
						keys[x] = keys[y];
						keys[y] = temp;
					}
				}
			}
			List<String> listKeys = new ArrayList<String>();
			for(int l = 0;l< keys.length;l = l + min){
				String flghtData = jedis.get(keys[l]);
				flghtData = keys[l].substring(keys[l].indexOf(" ")+1, keys[l].indexOf(" ")+6) + "," + flghtData;
				listKeys.add(flghtData);
			}
			map.put(ss[i], listKeys);

		}
		JSONObject json = JSONObject.fromObject(map);
		return json.toString();
	}

	/**
	 *TODO(方法的作用/映射)查询两个航班之间价格对比
	 * @Title: priceBetween
	 * @param dcity
	 * @param acity
	 * @param fightDate
	 * @param fNumber1
	 * @param fNumber2
	 * @param minute
	 * @return
	 * 创建日期：2019年1月28日 上午10:36:52
	 * @author 杨祖彧
	 */
	public String priceBetween(String dcity, String acity,
							   String fightDate, String fNumber1, String fNumber2, String minute) {
		String currentDate = HcDateUtil.getCurrentDate(HcDateUtil.yyyyMMdd10);
		Jedis jedis = null;
		jedis = RedisUtil.getJedis();
		String s = jedis.get(dcity + "-" + acity + fightDate);
		String[] ss = s.split(",");
		List<String> listKeys = new ArrayList<String>();
		List<String> listKeys1 = new ArrayList<String>();
		int min = 1;
		if("10".equals(minute)){
			min = 2;
		}else if("30".equals(minute)){
			min = 6;
		}else if("60".equals(minute)){
			min = 12;
		}
		for(int i = 0; i< ss.length;i++){
			if(fNumber1.equals(ss[i])){
				Set<String> set = jedis.keys(ss[i] + dcity + "-" + acity + fightDate + currentDate + "*");
				List<String> list = new ArrayList<>(set);
				String[] keys = new String[set.size()];
				for(int k = 0;k< list.size();k++){
					keys[k] = list.get(k);
				}
				for (int x = 0; x < list.size() - 1; x++) {
					for (int y = x + 1; y < list.size(); y++) {
						int xl = Integer.parseInt(keys[x].substring(keys[x].indexOf(" ")+1, keys[x].indexOf(" ")+3) + keys[x].substring(keys[x].indexOf(" ")+4, keys[x].indexOf(" ")+6));
						int yl = Integer.parseInt(keys[y].substring(keys[y].indexOf(" ")+1, keys[y].indexOf(" ")+3) + keys[y].substring(keys[y].indexOf(" ")+4, keys[y].indexOf(" ")+6));
						if (xl > yl) {
							String temp = keys[x];
							keys[x] = keys[y];
							keys[y] = temp;
						}
					}
				}
				for(int l = 0;l< keys.length;l = l + min){
					String flghtData = jedis.get(keys[l]);
					flghtData = keys[l].substring(keys[l].indexOf(" ")+1, keys[l].indexOf(" ")+6) + "," + flghtData;
					listKeys.add(flghtData);
				}
			}
			if(fNumber2.equals(ss[i])){
				Set<String> set = jedis.keys(ss[i] + dcity + "-" + acity + fightDate + currentDate + "*");
				List<String> list = new ArrayList<>(set);
				String[] keys = new String[set.size()];
				for(int k = 0;k< list.size();k++){
					keys[k] = list.get(k);
				}
				for (int x = 0; x < list.size() - 1; x++) {
					for (int y = x + 1; y < list.size(); y++) {
						int xl = Integer.parseInt(keys[x].substring(keys[x].indexOf(" ")+1, keys[x].indexOf(" ")+3) + keys[x].substring(keys[x].indexOf(" ")+4, keys[x].indexOf(" ")+6));
						int yl = Integer.parseInt(keys[y].substring(keys[y].indexOf(" ")+1, keys[y].indexOf(" ")+3) + keys[y].substring(keys[y].indexOf(" ")+4, keys[y].indexOf(" ")+6));
						if (xl > yl) {
							String temp = keys[x];
							keys[x] = keys[y];
							keys[y] = temp;
						}
					}
				}
				for(int l = 0;l< keys.length;l = l + min){
					String flghtData = jedis.get(keys[l]);
					flghtData = keys[l].substring(keys[l].indexOf(" ")+1, keys[l].indexOf(" ")+6) + "," + flghtData;
					listKeys1.add(flghtData);
				}
			}
		}
		List<String> listRe = new ArrayList<String>();
		for(int i = 0;i < listKeys.size();i++){
			String data1 = listKeys.get(i);
			String data2 = listKeys1.get(i);
			int price1 = Integer.parseInt(data1.split(",")[2]);
			int price2 = Integer.parseInt(data2.split(",")[2]);
			listRe.add(data1.split(",")[0] + "," +String.valueOf(price1 - price2));
		}
		JSONArray json = JSONArray.fromObject(listRe);
		return json.toString();
	}

	/**
	 *
	 *TODO(方法的作用/映射)查询单个航班多天
	 * @Title: flightDate
	 * @param dcity
	 * @param acity
	 * @param flightDate
	 * @param minute
	 * @param flightNumber
	 * @param startDate
	 * @param endDate
	 * @return
	 * @throws ParseException
	 * 创建日期：2019年1月28日 上午10:37:48
	 * @author 杨祖彧
	 */
	public String flightDate(String dcity, String acity, String flightDate, String minute, String flightNumber, String startDate, String endDate) throws ParseException{
		Jedis jedis = null;
		jedis = RedisUtil.getJedis();
		Map map = new HashMap();
		int min = 1;
		if("10".equals(minute)){
			min = 2;
		}else if("30".equals(minute)){
			min = 6;
		}else if("60".equals(minute)){
			min = 12;
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-mm-dd");
		java.util.Date udate = sdf.parse(startDate);
		boolean flag = false;
		long dateLong = udate.getTime();
		for(int i = 0;i <= 30 ;i++){
			java.sql.Date sdate = new java.sql.Date(dateLong);
			String rDate = sdate.toString();
			if(flag){
				break;
			}
			if(rDate.equals(endDate)){
				flag = true;
			}
			Set<String> set = jedis.keys(flightNumber + dcity + "-" + acity + flightDate + rDate + "*");
			List<String> list = new ArrayList<>(set);
			String[] keys = new String[set.size()];
			for(int k = 0;k< list.size();k++){
				keys[k] = list.get(k);
			}
			for (int x = 0; x < list.size() - 1; x++) {
				for (int y = x + 1; y < list.size(); y++) {
					int xl = Integer.parseInt(keys[x].substring(keys[x].indexOf(" ")+1, keys[x].indexOf(" ")+3) + keys[x].substring(keys[x].indexOf(" ")+4, keys[x].indexOf(" ")+6));
					int yl = Integer.parseInt(keys[y].substring(keys[y].indexOf(" ")+1, keys[y].indexOf(" ")+3) + keys[y].substring(keys[y].indexOf(" ")+4, keys[y].indexOf(" ")+6));
					if (xl > yl) {
						String temp = keys[x];
						keys[x] = keys[y];
						keys[y] = temp;
					}
				}
			}
			List<String> listKeys = new ArrayList<String>();
			for(int l = 0;l< keys.length;l = l + min){
				String flghtData = jedis.get(keys[l]);
				flghtData = keys[l].substring(keys[l].indexOf(" ")+1, keys[l].indexOf(" ")+6) + "," + flghtData;
				listKeys.add(flghtData);
			}
			map.put(rDate, listKeys);
			dateLong = dateLong + 86400000;
		}

		JSONObject json = JSONObject.fromObject(map);
		return json.toString();
	}

	public String flightDateTime(String dcity, String acity, String flightDate, String minute, String flightNumber1, String flightNumber2, String startDate, String endDate, String dateTime) throws ParseException{
		Jedis jedis = null;
		jedis = RedisUtil.getJedis();
		Map map = new HashMap();
		int min = 1;
		if("10".equals(minute)){
			min = 2;
		}else if("30".equals(minute)){
			min = 6;
		}else if("60".equals(minute)){
			min = 12;
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-mm-dd");
		java.util.Date udate = sdf.parse(startDate);
		boolean flag = false;
		long dateLong = udate.getTime();
		List<String> listKeys1 = new ArrayList<String>();
		for(int i = 0;i <= 30 ;i++){
			java.sql.Date sdate = new java.sql.Date(dateLong);
			String rDate = sdate.toString();
			if(flag){
				break;
			}
			if(rDate.equals(endDate)){
				flag = true;
			}
			String flghtData = jedis.get(flightNumber1 + dcity + "-" + acity + flightDate + rDate + " " + dateTime);
			flghtData = rDate + " " + dateTime + "," + flghtData;
			listKeys1.add(flghtData);
			dateLong = dateLong + 86400000;
		}
		map.put(flightNumber1, listKeys1);
		udate = sdf.parse(startDate);
		flag = false;
		dateLong = udate.getTime();
		List<String> listKeys2 = new ArrayList<String>();
		for(int i = 0;i <= 30 ;i++){
			java.sql.Date sdate = new java.sql.Date(dateLong);
			String rDate = sdate.toString();
			if(flag){
				break;
			}
			if(rDate.equals(endDate)){
				flag = true;
			}
			String flghtData = jedis.get(flightNumber2 + dcity + "-" + acity + flightDate + rDate + " " + dateTime);
			flghtData = rDate + " " + dateTime + "," + flghtData;
			listKeys2.add(flghtData);
			dateLong = dateLong + 86400000;
		}
		map.put(flightNumber2, listKeys2);

		JSONObject json = JSONObject.fromObject(map);
		return json.toString();
	}


	/**
	 * TODO(方法的作用/映射)
	 *
	 * @Title: main
	 * @param args
	 *            创建日期：2019年1月22日 下午4:14:43
	 * @author 杨祖彧
	 * @throws ParseException
	 */
	public static void main(String[] args) throws ParseException {
		// TODO Auto-generated method stub
//		Jedis jedis = null;
//		jedis = RedisUtil.getJedis();
//		Set<String> set = jedis.keys("MF847TAO-XMN2019-02-062019-01-22*");
//		List<String> list = new ArrayList<>(set);
//		String[] keys = new String[set.size()];
//		for(int k = 0;k< list.size();k++){
//			keys[k] = list.get(k);
//		}
//		for (int x = 0; x < list.size() - 1; x++) {
//			for (int y = x + 1; y < list.size(); y++) {
//				int xl = Integer.parseInt(keys[x].substring(keys[x].indexOf(" ")+1, keys[x].indexOf(" ")+3) + keys[x].substring(keys[x].indexOf(" ")+4, keys[x].indexOf(" ")+6));
//				int yl = Integer.parseInt(keys[y].substring(keys[y].indexOf(" ")+1, keys[y].indexOf(" ")+3) + keys[y].substring(keys[y].indexOf(" ")+4, keys[y].indexOf(" ")+6));
//				if (xl > yl) {
//					String temp = keys[x];
//					keys[x] = keys[y];
//					keys[y] = temp;
//				}
//			}
//		}
//		for(int i = 0;i< keys.length;i++){
//			System.out.println(keys[i]);
//		}
		getCtrip a = new getCtrip();
		System.out.println(a.flightDateTime("TAO", "XMN", "2019-01-29", "10", "MF8528", "SC8749", "2019-01-22", "2019-01-28", "07:00"));


	}

}
