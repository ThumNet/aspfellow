<html>
    <%
    
    dim myVar 
    myVar = 123
    
    function test()
        Response.Write("in method test")
        test = "abc"
    end function
    
    'function 
    ' kl
    'end function
    
    function te_st()
        Response.Write("test")
    end function
    
    function doStuff(input)
        doStuff = input & " doStuff"
    end function
    
    function doStuffMulti(input, _
                     otherparam)
        doStuffMulti = input & "-" & otherparam & " doStuff"
    end function
    
    sub other
        Response.write("other here</br>")
    end sub
    
    call other
    test()
    
    Response.write(doStuff("hi"))
    
    %>
    
    <b><%=Response.Write("test")%></b>
</html>