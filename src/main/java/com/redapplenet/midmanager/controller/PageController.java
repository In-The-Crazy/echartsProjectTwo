package com.redapplenet.midmanager.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * @ClassName PageController
 * @Description TODO
 * @Author yanqiong
 * @Date 2019/1/28 12:00
 */
@RequestMapping("/analysis")
@Controller
public class PageController {
    @RequestMapping(value = "/queryFlightPriceAnalysisFuture", method = RequestMethod.GET)
    public ModelAndView queryFlightPriceAnalysisFuture() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/flightPriceAnalysisFuture");
        return mav;
    }
    @RequestMapping(value = "/queryFlightPriceAnalysisHistory", method = RequestMethod.GET)
    public ModelAndView queryFlightPriceAnalysisHistory() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("/flightPriceAnalysisHistory");
        return mav;
    }


}
