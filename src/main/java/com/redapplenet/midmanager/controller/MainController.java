package com.redapplenet.midmanager.controller;

import com.huicent.common.util.getCtrip;
import com.redapplenet.midmanager.constant.CONST;
import com.redapplenet.midmanager.util.BaseEntity;
import com.redapplenet.midmanager.util.HcStringUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.util.*;

/**
 * @ClassName MainController
 * @Description TODO
 * @Author yanqiong
 * @Date 2019/1/28 12:37
 */
@RequestMapping("/mainSrv")
@Controller
public class MainController {
    @RequestMapping(value = "/queryChartOne", method = RequestMethod.POST)
    @ResponseBody
    public String queryChartOne(HttpServletRequest req) {
        String returnInfo = "-1";
        String fromCity = req.getParameter("fromCity");
        String arriveCity = req.getParameter("arriveCity");
        String takeOffTime = req.getParameter("takeOffTime");
        String intervalTime = req.getParameter("intervalTime");
        String firstFightNumber = req.getParameter("firstFightNumber");
        String secondFightNumber = req.getParameter("secondFightNumber");
        String thirdFightNumber = req.getParameter("thirdFightNumber");
        String startTime = req.getParameter("startTime");
        String endTime = req.getParameter("endTime");
        String fourthFightNumberOne = req.getParameter("fourthFightNumberOne");
        String fourthFightNumberTwo = req.getParameter("fourthFightNumberTwo");
        String fourthstartTime = req.getParameter("fourthstartTime");
        String fourthendTime = req.getParameter("fourthendTime");
        String dateTime = req.getParameter("dateTime");
        String queryType = req.getParameter("queryType");
        getCtrip gcp = new getCtrip();
        if (queryType.equals("1")) {
            returnInfo = gcp.getFight(fromCity, arriveCity, takeOffTime, intervalTime);
        } else if (queryType.equals("2")) {
            returnInfo = gcp.priceBetween(fromCity, arriveCity, takeOffTime, firstFightNumber, secondFightNumber, intervalTime);
        } else if (queryType.equals("3")) {
            try {
                returnInfo = gcp.flightDate(fromCity, arriveCity, takeOffTime, intervalTime, thirdFightNumber, startTime, endTime);
            } catch (ParseException e) {
                e.printStackTrace();
            }

        } else if (queryType.equals("4")) {
            try {
                returnInfo = gcp.flightDateTime(fromCity, arriveCity, takeOffTime, intervalTime, fourthFightNumberOne, fourthFightNumberTwo, fourthstartTime, fourthendTime ,dateTime);
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        return returnInfo;
    }

    @RequestMapping(value = "/china", method = RequestMethod.POST)
    @ResponseBody
    public String queryTableOne() throws IOException {
        String json = "";
        try {
            File jsonFile = ResourceUtils.getFile("classpath:china.json");
            json = FileUtils.readFileToString(jsonFile,"UTF-8");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return json;
    }

    @RequestMapping(value = "/flightPriceAnalysisFuture", method = RequestMethod.POST)
    @ResponseBody
    public BaseEntity flightPriceAnalysisFuture(HttpServletRequest req) {
        String returnInfo = null;
        BaseEntity baseEntity = new BaseEntity();
        try {
            String fromCity = req.getParameter("fromCity");
            String arriveCity = req.getParameter("arriveCity");
            String takeOffTimeStart = req.getParameter("takeOffTimeStart");
            String takeOffTimeEnd = req.getParameter("takeOffTimeEnd");
            String schedule = req.getParameter("schedule");
            int page = Integer.valueOf(req.getParameter("page"));
            int rows = Integer.valueOf(req.getParameter("rows"));
            int start = (page - 1) * rows;
            int end = (page - 1) * rows + rows;
            getCtrip gcp = new getCtrip();
            returnInfo = gcp.getForwardFight(fromCity, arriveCity, takeOffTimeStart, takeOffTimeEnd,schedule);
            JSONObject jsonObject = JSONObject.fromObject(returnInfo);
            Iterator<String> it = jsonObject.keys();
            List list = new ArrayList();
            List titleList = new ArrayList();
            int count = 0;
            while(it.hasNext()){
                Map map = new HashMap();
                String key = it.next();
                String value = jsonObject.getString(key);
                JSONArray jsonArray = JSONArray.fromObject(value);
                map.put("flightNo",key);
                if (count==0){
                    titleList.add("flightNo");

                }
                if(jsonArray.size()>0){
                    for(int i=0;i<jsonArray.size();i++){
                        String job = String.valueOf(jsonArray.get(i));  // 遍历 jsonarray 数组，把每一个对象转成 json 对象
                        String[] jobs = job.split(",");
                        if(StringUtils.isEmpty(jobs[1]) || jobs[1].equals("null")){
                            map.put(jobs[0],"");
                        } else {
                            map.put(jobs[0],jobs[2]);
                        }
                        //System.out.println(String.valueOf(job)) ;  // 得到 每个对象中的属性值
                        if (count==0) {
                            titleList.add(jobs[0]);
                        }


                    }
                }
                list.add(map);
                //System.out.println("key: "+key+",value:"+value);
                count++;

            }
            if(end>list.size()){
                end = list.size();
            }
            List<Map<String,Object>> returnList = list.subList(start,end);
            baseEntity.setRows(returnList);
            baseEntity.setTotal(list.size());
            baseEntity.setObj(titleList);
        } catch (ParseException e) {
            baseEntity.setIsSuccessOrfail(CONST.FAIL);
            baseEntity.setMessage(e.getMessage());
            e.printStackTrace();
        }
        return baseEntity;
    }

    @RequestMapping(value = "/flightPriceFutureChart", method = RequestMethod.POST)
    @ResponseBody
    public String flightPriceFutureChart(HttpServletRequest req) {
        String returnInfo = "-1";
        try {
            String fromCity = req.getParameter("fromCity");
            String arriveCity = req.getParameter("arriveCity");
            String takeOffTimeStart = req.getParameter("takeOffTimeStart");
            String takeOffTimeEnd = req.getParameter("takeOffTimeEnd");
            String schedule = req.getParameter("schedule");
            getCtrip gcp = new getCtrip();
            returnInfo = gcp.getForwardFight(fromCity, arriveCity, takeOffTimeStart, takeOffTimeEnd,schedule);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return returnInfo;
    }

    @RequestMapping(value = "/flightPriceHistoryChart", method = RequestMethod.POST)
    @ResponseBody
    public String flightPriceHistoryChart(HttpServletRequest req) {
        String returnInfo = "-1";
        try {
            String fromCity = req.getParameter("fromCity");
            String arriveCity = req.getParameter("arriveCity");
            String takeOffTimeStart = req.getParameter("takeOffTimeStart");
            String takeOffTimeEnd = req.getParameter("takeOffTimeEnd");
            String flightDate = req.getParameter("flightDate");
            getCtrip gcp = new getCtrip();
            returnInfo = gcp.getHistoryFight(fromCity, arriveCity,flightDate, takeOffTimeStart, takeOffTimeEnd);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return returnInfo;
    }
}
