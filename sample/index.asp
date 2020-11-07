<!--#include file="screen1a.inc"-->
<!--#include file="functions.asp"-->

<%
    function doStuff33(input)
        doStuff33 = input & " doStuff"
    end function

    test()
    Response.Write(doStuff33("123"))
    Response.Write("this is a test")
%>
<!--#include file="screen1b.inc"-->
