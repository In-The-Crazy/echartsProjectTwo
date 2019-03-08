package com.redapplenet.midmanager.util;

import org.apache.commons.lang.StringUtils;

import java.beans.Introspector;
import java.beans.PropertyDescriptor;


/**
 * huicent的字符串帮助类
 * @author donglong
 */
public class HcStringUtil {
	
	/**
	 * 将数组合并成带分隔符的字符串(中间以逗号隔开)
	 * @param strs			:	待合并的字符串数组
	 * @return
	 */
	public static String unite(String[] strs) {
		return unite(strs, ",");
	}

	/**
	 * 将数组合并成带指定分隔符的字符串
	 * @param strs			:	待合并的字符串数组
	 * @param strSeparator	：	分隔符
	 * @return
	 */
	public static String unite(String[] strs, String strSeparator) {
		if(strs==null || strs.length==0 
				|| strSeparator==null || strSeparator.length()==0 ) return "";
		String str = "";
		for(int i=0;i<strs.length;i++){
			if(strs[i].trim().length()==0) continue;
			str+=strSeparator+strs[i];
		}
		if(str.length()>1)
			return str.substring(strSeparator.length());
		else 
			return str;
	}
	
	/**
	 * 将对象的所有属性合并成字符串输出，分隔符为;
	 * @param component
	 * @return
	 */
	public static String toString(Object obj) {
		try {
			PropertyDescriptor[] props = Introspector.getBeanInfo(obj.getClass()).getPropertyDescriptors();
			StringBuilder builder = new StringBuilder();
			for (PropertyDescriptor descriptor : props) {
				builder.append(descriptor.getName()).append("=").append(
						descriptor.getReadMethod().invoke(obj)).append("; ");
			}
			return builder.toString();
		} catch (Exception e) {
			return "";
		}
	}

	/**
	 * 将多个object合并成字符串，分隔符为" "
	 * @param objects
	 * @return
	 */
	public static String toString(Object... objects) {
		return toString(" ", objects);
	}

	/**
	 * 将多个object合并成字符串
	 * @param strSeparator	：	分隔符
	 * @param objects
	 * @return
	 */
	public static String toString(String sep, Object... objects) {
		if (objects.length == 0)
			return "";
		StringBuilder builder = new StringBuilder();
		for (Object object : objects) {
			builder.append(sep).append(object);
		}
		return builder.substring(2);
	}

	/**
	 * 将多个object的类名合并成字符串
	 * @param strSeparator	：	分隔符
	 * @param objects
	 * @return
	 */
	public static String toClassNameString(String strSeparator, Object... objects) {
		if (objects.length == 0)
			return "";
		StringBuilder builder = new StringBuilder();
		for (Object object : objects) {
			builder.append(strSeparator);
			if (object == null) {
				builder.append("null");
			} else {
				builder.append(object.getClass().getName());
			}
		}
		return builder.substring(2);
	}


	/**
	 * 将字符串的首字母大写
	 * @param msg
	 * @return
	 */
	public static String capfirstChar(String str) {
		char[] msgs = str.toCharArray();
		msgs[0] = (char) (msgs[0] - 32);
		return String.valueOf(msgs);
	}

	/**
	 * 判断字符串是否是空字符串
	 * @param str
	 * @return
	 */
	public static boolean isEmpty(String str) {
		return StringUtils.isEmpty(str);
	}

	/**
	 * 判断字符串是否是空字符串,如果是，则返回空（是空不是null）；否则返回字符串的值
	 * @param str
	 * @return
	 */
	public static String checkNull(String str) {
		if (str==null){
			return "";
		}
		return str;
	}


}
