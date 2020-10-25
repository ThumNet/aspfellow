<!-- #include file = "screen1a.inc" -->

<%
	dim myVar
	myVar = "test"
    Response.Write("this is a test")
%>
<!--#include file="screen1b.inc"-->

<b><%=myVar%></b>
