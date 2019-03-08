package com.redapplenet.midmanager.util;

import java.util.List;

public class TreeEntity
{
	private String id;
	private String text;
	private String value;
	private boolean checked = false;
	private String state;
	private Attributes attributes;
	
	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public Attributes getAttributes() {
		return attributes;
	}

	public void setAttributes(Attributes attributes) {
		this.attributes = attributes;
	}

	private List<TreeEntity> children;

	public TreeEntity()
	{
		super();
	}

	public String getId()
	{
		return id;
	}

	public void setId(String id)
	{
		this.id = id;
	}

	public String getText()
	{
		return text;
	}

	public void setText(String text)
	{
		this.text = text;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public List<TreeEntity> getChildren()
	{
		return children;
	}

	public void setChildren(List<TreeEntity> children)
	{
		this.children = children;
	}

	
	public boolean isChecked() {
		return checked;
	}

	public void setChecked(boolean checked) {
		this.checked = checked;
	}

	public TreeEntity(String id, String text, List<TreeEntity> children) {
		super();
		this.id = id;
		this.text = text;
		this.children = children;
	}
}
