package com.redapplenet.midmanager.util;

import com.redapplenet.midmanager.constant.CONST;

import java.util.List;

public class BaseEntity {

	//返回信息
	private String message=CONST.MESSAGE_SUCCESS;
	//返回成功失败标识
	private String isSuccessOrfail=CONST.SUCCESS;
	//返回datagrid总条数参数
	private int total;
	//返回datafrid行参数
	private List rows;
	
	//返回一个对象
	private Object obj;
	
	//返回一个TreeEntity的list的对象
	private List<TreeEntity> treeList;
	
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	public String getIsSuccessOrfail() {
		return isSuccessOrfail;
	}
	public void setIsSuccessOrfail(String isSuccessOrfail) {
		this.isSuccessOrfail = isSuccessOrfail;
	}
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public List getRows() {
		return rows;
	}
	public void setRows(List rows) {
		this.rows = rows;
	}
	public Object getObj() {
		return obj;
	}
	public void setObj(Object obj) {
		this.obj = obj;
	}
	public List<TreeEntity> getTreeList() {
		return treeList;
	}
	public void setTreeList(List<TreeEntity> treeList) {
		this.treeList = treeList;
	}
}