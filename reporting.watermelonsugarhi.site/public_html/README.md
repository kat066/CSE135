Site url: reporting.watermelonsugarhi.site
basic level: username: grader         password: cse135    
admin level: username: admingrader    password: cse135      

Design decisions: see blow

Part 1 - User Authentication     
Authentication
Implementation:We store session data using express-session library, which automatically   verifies session id for us.
We use mongoDB for user management, and stores username, email, hashed password using bcrypt, and whether or not user
is an admin into this database. When user tries to log in, we first check if user is using an email or password, then, 
we get the user data that matches the given username/password, and compare their password, if everything matches, user will be
redirected to index page. We use the passport library to help us acheieve the authentication.
 Our implementation will also store an indicator that indicates whether a user is admin or not.

Login: - if username and password match what we have in the record, we move to next page    
       - if username and password do not match what we have in the record, we prompt the   
       user to enter the username and password again to login    
Logout: when user is logged in, and they hit log out button, the user will be logged out    
        and go to the login page     
Users(implemented in part 2): a CRUD grid showing all users (username, email, hashed    
password, and an admin boolean)

Reason: We chose mongoDB this time because we used Mysql for HW3, and wanted to experiment with MongoDB. Also MongoDB is a non-relational
database, which fits the purpose of user management. We use node.js and express because we find it easir to manage requests and session with 
the help of libraries. We chose passport library to help us authenticate our users and we chose moogoose to help us with CRUD action becasue
it was introduced in the discussion session, and we do find them helpful because Mongoose can format and model our data for us.
       
Part 2 - User Management    
Users credentials     
basic level: username: grader         password: cse135    
admin level: username: admingrader    password: cse135      
    
Under admin user management:     
- Create: You can create a user using the drop down at the end of the list, pay attention     
that if the new username or email(both or either) is already in the system, you can not     
create this new user. Please use a new username/email.          
- Read: The user list was showed under admin user management page       
- Update: use the edit button at the end of each user entry to change the record.          
- Delete: use the delete button at the end of each user entry to delete the record.       
          
Part 3 - Reporting Dashboard      
Dashboard      
This part contain 3 different metrics with three different presentations (2 charts and 1 grid)      
We used:     
​Bar chart to keep track of durations for each request becasue bar chart can show us the difference for the durations.
​Pie chart to represent user agent percentage becasue this show us the user devides and which deivce is most common among users.
​Grid to list StartTime, FetchStart, RequestTime,  RespondStart, RespondEnd for all request.
​    
​We chose the above data to analize how fast is our website in terms of Request durations, StartTime, FetchStart, RequestTime, etc.     
​We are also collecting users device model and browser type because we want to see what type of device is most commonly used.    
​We can adjust our​ website volume accordingly so that we could bring the good user experience to people who are using our website.    
​     
​
​
Part 4 - Detailed Report     (2 charts and 1 grid)  (Use top left report drop-down button to see detailed report.)
Report    
(Chart)User Languages Analysis:  
 - Why: In an increasingly connected world, multi-language websites are becoming more and more common.      
And user experience and customer support are very important to every company’s success.   
By analysing data like this we should be able to find out what user speaking what laguage are using our website,      
We could develop our webpage using different languages that are commanly used in our user group.     
 - How: We are taking data from our static datas, detecting browser preference is the most common and most effective way 
used by websites to detect your preferred language automatically compare to looking up to ip address, which is     
hard and tedious.  
 - Read from chart: From the chart we can see that the language used among our users is Engilsh, but along we have seen some
 Chinses users, Japanese users, etc. If we are making a to Client website, we can definately consider having different
 language for our website.
 - Bebefit: We could develop features like automatically detecting users prefered languages, for examples when you are       
using google search in Japan,when  you search apple, the top feed will taking you to apple.com/jp/ instead of apple.com    
In this way, the user do not need to scrolldown to the end of the page then change the language/region. Thus, this  
will bring good user experience to our web users.     




 (Chart)User Devices Analysis:  
  - Why:  Device upgrade is more and more frequent right now, there are several devices coming out every year.
  those new devices have stronger CPU, larger RAM, faster storage, so they can handle big website easily. However, not    
  all users will get a new phone or a new labtop every year. So, when making a website, we need to consider those     
  devices too. We need to make our website run fast on old devices too.
  Also, some user agents will be banned from the website because they think this agent is a bot. By analyzing this, we could
  reduce the possiblity of blocking our real user.
   - How: We are taking the data from our static datas - User Agent. And we are using pie chart to show what kind of devices   
   are mostly used among our users; that way we know what agent are most common ones, so we could rule out those are not   
   so common. Also, we could tell from the data, what operating system my users are using, what browsers they are using.    
   And we could adjust our website accrordingly.   
 - Read from Chart: We can see from the pie chart that big part of our users are using Windows computer, but some of iphone, ipad, mac 
 users too. For me, when I open the website, it is too big for my phone, and I will have to manually adjust it to proper size for me. So, with
 this data, we can make our website to be auto adjust to different devices.
   - Bebefit: By doing this we could improve the user experience. And users will find our website is easier to use(faster, adjust to      
  their devices, etc.). This is a win-win situation.    
  
  
(Grid)Response Time Analysis:      
 - Why:  We want to keep track of how is our website performing - is it too slow for our user?    
 If it's too slow for users, we definatly need to speed it up.    
 - How:    So we need data from the performance data. We obtianed duration of page load, page transfer size,    
 and page decoded size.  and we are allowing our data to be sorted. This way we can compare the fastest time and     
 the slowest time we have. Becasue we can not view all time at once and without the compare we will not able to tell     
 if this druation time is fast or slow.    
 - Read from Grid: At the time I was wtring this report, the longest duration is, 624.4, and the shortest is 50.2.
 So this is very obvious that the fastest is way fast for the slowest. So, if we trace back thru the session id, we can 
 find what request this was and what devices was this session on, and we can utilize for them on our website.
 - Bebefit:  By analysing the response time, we are able to trace back and improve out website, which essentially falls back to 
 improve our user experience and keep and bring traffic to the site.

