package com.huicent.server.util;

import java.sql.Timestamp;
import java.text.DateFormatSymbols;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.redapplenet.midmanager.util.HcStringUtil;
import org.apache.commons.lang.time.DateUtils;

/**
 * huicent的日期帮助类
 * @author donglong
 */
public class HcDateUtil {
	/** 格式：dd*/
	public static String dd="dd";
	/** 格式：MM*/
	public static String MM="MM";
	/** 格式：yyyy*/
	public static String yyyy="yyyy";
	/** 格式：yyyyMM*/
	public static String yyyyMM6="yyyyMM";
	/** 格式：yyyy-MM*/
	public static String yyyyMM7="yyyy-MM";
	/** 格式：yyyyMMdd*/
	public static String yyyyMMdd8="yyyyMMdd";
	/** 格式：yyyy-MM-dd*/
	public static String yyyyMMdd10="yyyy-MM-dd";
	/** 格式：yyyyMMddHHmmss*/
	public static String yyyyMMddHHmmss14="yyyyMMddHHmmss";
	/** 格式：yyyyMMddHHmm*/
	public static String yyyyMMddHHmm12="yyyyMMddHHmm";
	/** 格式：yyyyMMdd HH:mm*/
	public static String yyyyMMddHHmm14="yyyyMMdd HH:mm";
	/** 格式：yyyy-MM-dd HH:mm*/
	public static String yyyyMMddHHmm16="yyyy-MM-dd HH:mm";
	/** 格式：yyyy-MM-dd HH:mm:ss*/
	public static String yyyyMMddHHmmss19="yyyy-MM-dd HH:mm:ss";
	/** 格式：yyyyMMdd HH:mm:ss*/
	public static String yyyyMMddHHmmss17="yyyyMMdd HH:mm:ss";
	/** 格式：yyyyMMddHHmmssSSS*/
	public static String yyyyMMddHHmmssSSS17="yyyyMMddHHmmssSSS";

	public static String yyyyMMddHHmmssSSS23="yyyy-MM-dd HH:mm:ss.SSS";
	
	/** 格式：HHmm*/
	public static String HHmm4="HHmm";
	/** 格式：HH:mm*/
	public static String HHmm5="HH:mm";
	/** 格式：HHmmss*/
	public static String HHmmss6="HHmmss";
	/** 格式：HH:mm:ss*/
	public static String HHmmss8="HH:mm:ss";
	
	/** 格式：yyMM*/
	public static String yyMM4="yyMM";
	/** 格式：yy-MM*/
	public static String yyMM5="yy-MM";
	/** 格式：yyMMdd*/
	public static String yyMMdd6="yyMMdd";
	/** 格式：yy-MM-dd*/
	public static String yyMMdd8="yy-MM-dd";
	/** 格式：yyMMddHHmmss*/
	public static String yyMMddHHmmss12="yyMMddHHmmss";
	/** 格式：yyMMdd HH:mm*/
	public static String yyMMddHHmm12="yyMMdd HH:mm";
	/** 格式：yyMMddHHmm*/
	public static String yyMMddHHmm10="yyMMddHHmm";
	/** 格式：yy-MM-dd HH:mm:ss*/
	public static String yyMMddHHmmss17="yy-MM-dd HH:mm:ss";
	/** 格式：yyMMddHHmmssSSS*/
	public static String yyMMddHHmmssSSS15="yyMMddHHmmssSSS";
	/** 格式：MM月dd日HH:mm*/
	public static String MMddHHmm="MM月dd日HH:mm";
	
	/** 格式：ddMMMyy  可以处理30DEC12的情况 */
	public static String ddMMMyy="ddMMMyy";
	
	/**
	 * HHmm转化为HH:mm
	 * @param time
	 * @author 赵毅
	 * @date 2012-6-14
	 */
	public static String HHmm4ToHHmm5(String time){
		String re="";
		if(time!=null){
			if(time.length()==4){
				String minute=time.substring(0,2);
				String second=time.substring(2,4);
				re=minute+":"+second;
			}
		}
		return re;
	}
	
	
	/**
	 * 得到当前年份
	 * @return
	 */
	public static String getYearOfCurrentDate() {
		return String.valueOf(Calendar.getInstance().get(Calendar.YEAR));
	}
	
	/**
	 * 得到当前日期
	 * @return
	 */
	public static Date getCurrentDate() {
		return Calendar.getInstance().getTime();
	}
	
	/**
	 * 得到当前日期
	 * @return
	 */
	public static Timestamp getCurrentTimestamp() {
		return new Timestamp(Calendar.getInstance().getTime().getTime());
	}
	
	/**
	 * 得到当前日期  格式为：yyyy-MM-dd HH:mm:ss
	 * @return
	 */
	public static String getCurrentDateyyyyMMddHHmmss19() {
		return date2string(getCurrentDate(),yyyyMMddHHmmss19);
	}
	
	/**
	 * 得到当前日期的字符串格式
	 * @return
	 */
	public static String getCurrentDate(String pattern) {
		return date2string(getCurrentDate(),pattern);
	}
	
	/**
	 * 将date转换成string
	 * @param date
	 * @param pattern
	 * @return
	 */
	public static String date2string(Date date, String pattern) {
		if(null==date){
			return "";
		}
		return getSimpleDateFormat(pattern).format(date);
	}
	
	/**
	 * 将string转换成date
	 * @param date
	 * @param pattern
	 * @return
	 */
	public static Date string2date(String strDate, String pattern) {
		if(HcStringUtil.isEmpty(strDate)){
			return null;
		}
		try {
			return getSimpleDateFormat(pattern).parse(strDate);
		} catch (ParseException e) {
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * 将string转换成timestamp
	 * @param date
	 * @param pattern
	 * @return
	 */
	public static Timestamp string2timestamp(String strDate, String pattern) {
		if(HcStringUtil.isEmpty(strDate)){
			return null;
		}
		Date date=string2date( strDate,  pattern);
		return date2timestamp(date);
	}
	
	/**
	 * 将date转换成timestamp
	 * @param date
	 * @return
	 */
	public static Timestamp date2timestamp(Date date) {
		if(null==date){
			return null;
		}
		return new Timestamp(date.getTime());
	}
	
	/**
	 * 将一种日期格式的字符串转换成另外一种日期格式的字符串
	 * @param strDate
	 * @param pattern
	 * @return
	 */
	public static String dateStr2dateStr(String strDate,String srcPattern ,String targetPattern){
		if(HcStringUtil.isEmpty(strDate)){
			return "";
		}
		Date date=string2date(strDate, srcPattern);
		return date2string(date, targetPattern);
	}
	
	/**
	 * 获取两个时间间相差的天数
	 * @param begindate
	 * @param enddate
	 * @param pattern
	 * @return
	 */
	public static int getBetweenDays(String begindate, String enddate ,String pattern){
		Date _beginDate = string2date(begindate, pattern);
		Date _endDate = string2date(enddate, pattern);
		return getBetweenDays(_beginDate, _endDate);
	}
	
	/**
	 * 获取两个时间间相差的天数
	 * @param begindate
	 * @param enddate
	 * @param pattern
	 * @return
	 */
	public static int getBetweenDays(Date begindate, Date enddate){
//		Long l = (enddate.getTime() - begindate.getTime()) / (3600 * 24 * 1000);
//		return  l.intValue();
		return (int) ((enddate.getTime()-begindate.getTime())/1000/60/60/24);
	}
	
	public static long getBetweenDays2(String begindate, String enddate ,String pattern){
		Date _beginDate = string2date(begindate, pattern);
		Date _endDate = string2date(enddate, pattern);
		return getBetweenDays2(_beginDate, _endDate);
	}
	public static long getBetweenDays2(Date begindate, Date enddate){
		long l = (enddate.getTime() - begindate.getTime()) / (3600 * 24 * 1000);
		return  l;
	}
	/**
	 * 将指定的日期增加或者减少一定的天数
	 * @param date
	 * @param amount
	 * @return
	 */
	public static Date addDays(Date date,int amount){
		return DateUtils.addDays(date, amount);
	}
	
	/**
	 * 将指定的日期增加或者减少一定的毫秒数
	 * @param date
	 * @param amount
	 * @return
	 */
	public static Date addMilliseconds(Date date,int amount){
		return DateUtils.addMilliseconds(date, amount);
	}
	
	/**
	 * 将指定的日期增加或者减少一定的小时数
	 * @param date
	 * @param amount
	 * @return
	 */
	public static Date addHours(Date date,int amount){
		return DateUtils.addHours(date, amount);
	}
	
	/**
	 * 将指定的日期增加或者减少一定的分钟数
	 * @param date
	 * @param amount
	 * @return
	 */
	public static Date addMinutes(Date date,int amount){
		return DateUtils.addMinutes(date, amount);
	}
	
	/**
	 * 将指定的日期增加或者减少一定的月数
	 * @param date
	 * @param amount
	 * @return
	 */
	public static Date addMonths(Date date,int amount){
		return DateUtils.addMonths(date, amount);
	}
	
	/**
	 * 将指定的日期增加或者减少一定的秒数
	 * @param date
	 * @param amount
	 * @return
	 */
	public static Date addSeconds(Date date,int amount){
		return DateUtils.addSeconds(date, amount);
	}
	
	/**
	 * 将指定的日期增加或者减少一定的星期数
	 * @param date
	 * @param amount
	 * @return
	 */
	public static Date addWeeks(Date date,int amount){
		return DateUtils.addWeeks(date, amount);
	}
	
	/**
	 * 将指定的日期增加或者减少一定的年数
	 * @param date
	 * @param amount
	 * @return
	 */
	public static Date addYears(Date date,int amount){
		return DateUtils.addYears(date, amount);
	}
	
	/**
	 * 将指定的时间，增加或者减少指定的小时，分钟或者秒数
	 * @param date
	 * @param HH
	 * @param mm
	 * @param ss
	 * @return
	 */
	public static Date addTimeByHHmmss(Date date,int HH,int mm, int ss) {
		long Time=(date.getTime()/1000)+60*60*HH+60*mm+ss; 
		Date date1 = new Date();
		date1.setTime(Time*1000); 
		return date1;
	}

	/**
	 * 将当前的时间，增加或者减少指定的小时，分钟或者秒数
	 * @param HH
	 * @param mm
	 * @param ss
	 * @return
	 */
	public static Date addTimeByHHmmss(int HH,int mm, int ss) {
		return addTimeByHHmmss(new Date(),  HH,  mm,   ss);
	}
	
	public static final int decodeMonth(String month){
		String as[] = {"JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT","NOV", "DEC"};
		for(int i = 0; i < 12; i++){
			if(as[i].equals(month.toUpperCase()))
				return i;
		}
		return -1;
	}

	public static final String encodeMonth(int i){
		String as[] = {"JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT","NOV", "DEC"};
		if(i >= 0 && i < 12)
			return as[i];
		//else
			//throw new DateFormatException("BAD MONTH: " + i);
		return null;
	}
	
	private static final SimpleDateFormat getSimpleDateFormat(String pattern){
		if(pattern.indexOf("MMM")>=0){
			DateFormatSymbols symbols=new DateFormatSymbols();
			String[] oddMonthAbbreviations = new String[]{"JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT","NOV", "DEC"};   
			symbols.setShortMonths(oddMonthAbbreviations);   
			return new SimpleDateFormat(pattern,symbols);
		}
		return new SimpleDateFormat(pattern);
	}
	
	/**
	 * 将  (yyyy年MM月dd日) 日期格式转换为 (yyyy-MM-dd)
	 * @param date
	 * @return
	 */
	public static String FomatStringDate(String date){
		String newDate = "";
		if(date != null && !(date.isEmpty()) && !(date.trim().isEmpty())){
			date = date.replace("年", "-");
			date = date.replace("月", "-");
			date = date.replace("日", "");
			String[] sdate = date.split("-");
			if(sdate[1].length()<2){
				sdate[1]="0"+sdate[1];
			}
			if(sdate[2].length()<2){
				sdate[2]="0"+sdate[2];
			}
			newDate = sdate[0]+"-"+sdate[1]+"-"+sdate[2];
		}
		return newDate;
	}
	/**
	 * 将  (yyyy-MM-dd) 日期格式转换为 (yyyy年MM月dd日)
	 * @param date
	 * @return
	 */
	public static String FomatStringDate2(String date){
		String newDate = "";
		if(date != null && date != "" && !(date.isEmpty()) && !(date.trim().isEmpty())){
			String[] sdate = date.split("-");
			if(sdate[1].length()>1){
				String d1 = sdate[1].substring(0, 1);
				String d2 = sdate[1].substring(1, sdate[1].length());
				if(d1.equals("0")){
					sdate[1] = d2;
				}
			}
			if(sdate[2].length()>1){
				String d3 = sdate[2].substring(0, 1);
				String d4 = sdate[2].substring(1, sdate[2].length());
				if(d3.equals("0")){
					sdate[2] = d4;
				}
			}
			newDate = sdate[0]+"年"+sdate[1]+"月"+sdate[2]+"日";
		}
		return newDate;
	}
	
	public static String weekAdd(String week, int num){
		String newWeek = "";
		if(week!=null && ! week.isEmpty()){
			String[] weeks ={"星期一","星期二","星期三","星期四","星期五","星期六","星期日"}; 
			int a = 0;
			for(int i = 0 ; i < weeks.length; i ++){
				if(week.equals(weeks[i])){
					a = i;
				}
			}
			int t  = (num + a)%7; 
			newWeek = weeks[t];
		}
		return newWeek;
	}
	
	 //获取前月的第一天
	public static String firstDayOfMonth(){
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd"); 
        Calendar curCal = Calendar.getInstance();//获取当前日期 
        curCal.add(Calendar.MONTH,0);
        curCal.set(Calendar.DAY_OF_MONTH,1);//设置为1号,当前日期既为本月第一天 
        String firstDay = format.format(curCal.getTime());
		return firstDay;
	}
	
	//获取当前月最后一天
	public static String lastDayOfMonth(){
        Calendar ca = Calendar.getInstance();  
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd"); 
        ca.set(Calendar.DAY_OF_MONTH, ca.getActualMaximum(Calendar.DAY_OF_MONTH));  
        String lastDay = format.format(ca.getTime());
		return lastDay;
	}
	
	// 获取指定日期的星期数，周一返回1，周二返回2，...，周日返回7
	public static int getDayOfWeekByDate(String dateStr)
	{
		Date date = HcDateUtil.string2date(dateStr, HcDateUtil.yyyyMMdd8);
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int day_of_week = cal.get(Calendar.DAY_OF_WEEK)-1;
        day_of_week = (day_of_week == 0) ? 7 : day_of_week;
        
        return day_of_week;
	}
	
	public static long dateDiffHour(String startTime, String endTime, String format) {
		//按照传入的格式生成一个simpledateformate对象
		SimpleDateFormat sd = new SimpleDateFormat(format);
		long nd = 1000*24*60*60;//一天的毫秒数
		long nh = 1000*60*60;//一小时的毫秒数
		long diff;
		long hour = -1L;
		try {
		//获得两个时间的毫秒时间差异
		diff = sd.parse(endTime).getTime() - sd.parse(startTime).getTime();
		hour = diff%nd/nh;//计算差多少小时
		} catch (Exception e) {
		     e.printStackTrace();
		}
		return hour;
	}
	
	/**
	 * 8位日期转为10日期
	 * @param date
	 * @return
	 */
	public static String date8toDate10(String date) {
		if(null==date) return "";
		if(date.length()==8){
			return HcDateUtil.dateStr2dateStr(date, HcDateUtil.yyyyMMdd8, HcDateUtil.yyyyMMdd10);			
		}
		return date;
	}
	
	/**
	 * 得到当前日期的下一天
	 * @return
	 */
	public static String getNextDay() {
		
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DAY_OF_YEAR, 1);
		Date date = calendar.getTime();
		
		return date2string(date,HcDateUtil.yyyyMMdd8);
	}
	
    /**
     * 获取当前时间的前后某一天
     * @param dayNumber
     * @param dateFormat
     * @return
     */
	public static String getSomeDay(int dayNumber, String dateFormat) {
		
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DAY_OF_YEAR, dayNumber);
		Date date = calendar.getTime();
		
		return date2string(date,dateFormat);
	}
	
	/**
	 * 取系统当前的Utc时间
	 * @return
	 */
	public static String getUTCTimeString()
	  {
	    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS0000'Z'");

	    Calendar cal = Calendar.getInstance();

	    int zoneOffset = cal.get(15);

	    int dstOffset = cal.get(16);

	    cal.add(14, -(zoneOffset + dstOffset));
	    return sdf.format(cal.getTime());
	  }
	
	/**  
	  * 根据一个日期，返回是星期几的字符串  
	  *  
	  * @param sdate  
	  * @return  
	  */  
	public static String getWeek(String sdate) {   
		  // 再转换为时间   
//		  Date date = TestWeek.strToDate(sdate);  
		  Date date = HcDateUtil.string2date(sdate, HcDateUtil.yyyyMMdd10);
		  Calendar c = Calendar.getInstance();   
		  c.setTime(date);   
		  // int hour=c.get(Calendar.DAY_OF_WEEK);   
		  // hour中存的就是星期几了，其范围 1~7   
		  // 1=星期日 7=星期六，其他类推   
		  return new SimpleDateFormat("EEEE").format(c.getTime());   
		 }   
	
	/**  
	  * 根据一个日期，返回是星期几的中文 
	  *  
	  * @param sdate  
	  * @return  
	  */ 
	public static String getWeekStr(String sdate){   
		  String str = "";   
		  str = HcDateUtil.getWeek(sdate);   
		  if("1".equals(str)){   
		   str = "星期日";   
		  }else if("2".equals(str)){   
		   str = "星期一";   
		  }else if("3".equals(str)){   
		   str = "星期二";   
		  }else if("4".equals(str)){   
		   str = "星期三";   
		  }else if("5".equals(str)){   
		   str = "星期四";   
		  }else if("6".equals(str)){   
		   str = "星期五";   
		  }else if("7".equals(str)){   
		   str = "星期六";   
		  }   
		  return str;   
	}   
	
	/**  
	  * 根据一个日期，返回是星期几的中文 
	  *  
	  * @param sdate  Monday
	  * @return  星期几
	  */ 
	public static String getWeekStr2(String sdate){   
		  String str = "";   
		  if("Sunday".equals(sdate)){   
		   str = "星期日";   
		  }else if("Monday".equals(sdate)){   
		   str = "星期一";   
		  }else if("Tuesday".equals(sdate)){   
		   str = "星期二";   
		  }else if("Wednesday".equals(sdate)){   
		   str = "星期三";   
		  }else if("Thursday".equals(sdate)){   
		   str = "星期四";   
		  }else if("Friday".equals(sdate)){   
		   str = "星期五";   
		  }else if("Saturday".equals(sdate)){   
		   str = "星期六";   
		  }   
		  return str;   
	}  
	public static String gethourBetweenDates(String date1,String date2,String partern) throws Exception{
		SimpleDateFormat sd = new SimpleDateFormat(partern);
		long nd = 1000*24*60*60;//一天的毫秒数
		long nh = 1000*60*60;//一小时的毫秒数
		long diff;
		long hour = -1L;
			//获得两个时间的毫秒时间差异
		diff = sd.parse(date2).getTime() - sd.parse(date1).getTime();
		hour = diff/nh;
		long minu = diff%nh;
		return hour+"小时,"+minu/(1000*60)+"分钟";
	}

	public static long getDiffBetweenDateTimes(String date1,String date2,String partern) throws Exception{
		SimpleDateFormat sd = new SimpleDateFormat(partern);
		long diff;
		//获得两个时间的毫秒时间差异
		diff = sd.parse(date2).getTime() - sd.parse(date1).getTime();
		return diff;
	}
}
