# Maintenance Scheduler Application
This application is something I made to keep track of all household maintenance that needs to be kept track of. Things like Oil changes, HVAC filter replacements, cat water fountain filter replacements, air purifier...and so on. 
All of these have different time frames in which they need to have upkeep done on them, and I wanted to design something that could give you a visual of when they need to be taken care of. 

##How to Use Application
-Hit the Add Task button at the bottom of the screen.
  -In the first box, select how often you want a task to repeat.
  -In the second box, select the day of the week/month the task will occur on. If Monthly Repeat is selected, also pick the month gap between upkeep days (1 being each month, 2 being skip a month, 12 being skip a year).
  -In the third box, Add a title for the task. If Biweekly repeat was selected, you can also pick if the task will start on the next occurance of the weekday selector, or skip one and start on the next week.
  -In the fourth box, you hit the confirm Task button and the task will be added to a list that appears in a scroll panel on the main screen. (The Notification Button is not currently Functional).
-Tapping on a task will highlight the days during that month that the task maintenance needs to occur. Tapping on a day on the calendar will highlight the task in the Task Box Panel.
-Holding down on a task in the Task Box Panel will let you delete a task.

## Creation Process
I started by doing a few simple drawings to give me an idea of how the application would look and function. I did this fairly quick and it isn't pretty, but it helped give me some sort of structure that i could aim towards and follow:
![Paper Design of Home Maintenance Application](https://github.com/wward49/home-maintenance-app/blob/master/ImagesHM/20250925_170053.jpg)


I was fairly new to using React/Native, so a lot of the what I did in the beginning was playing around with buttons and functions. Getting comfortable with the syntax of hooks and props was a challange at first, but I grew more confident using it as the project came along. Once I started to refactor code in the App file into their own different component files, I really started to get the hang of it. The repetition was key to learning and I was able to see exactly where and how the hooks and handler functions and props were coming into play. Getting the Calendar and Tasks to work together took some time. Much of that utilities file I made with a lot of curated help from AI. Once I got everything working, I had to iron out a few logic bugs. Going back and dealing with the Biweekly repeat selector and setting up anchor days for that was annoying. Honestly a lot of that I could probably go back through or start from scratch and come up with a cleaner solution. Currently it uses a little toggle button to choose if you want to start on the current week or the next week...but a better way to do it would probably be to have it be more like the Monthly Selector where you pick a day of the month instead of a day of the week...then just have that be the anchor. 

## Improvements
-I tried to get a lot of what I thought should be a self contained component in a file of its own. Even so, the App file definatly seems large and could be broken down more. 
-I was hoping to add a notification system into the application, but that is something I had to put on hold for another time. 
-I used my own personal android phone for this, but in the future I will likely use a vitural phone emulator to test different devices.
-As stated earlier, the biweekly repeater and calendar need to be refactored. They work, but it isnt very intuitive.

# Overall this was an awesome project that i wanted to do and am happy that I was able to get it to where it is. It has a lot of avenues for improvement, but in it's current state it does exactly what I want it to and solves the problem I set out to fix. 
<p>
  <img src="https://github.com/wward49/home-maintenance-app/blob/master/ImagesHM/Screenshot_20250926_144302_Expo%20Go.jpg" width="300">
  <img src="https://github.com/wward49/home-maintenance-app/blob/master/ImagesHM/Screenshot_20250926_144308_Expo%20Go.jpg" width="300">
  <img src="https://github.com/wward49/home-maintenance-app/blob/master/ImagesHM/Screenshot_20250926_144356_Expo%20Go.jpg" width="300">
  <img src="https://github.com/wward49/home-maintenance-app/blob/master/ImagesHM/Screenshot_20250926_144740_Expo%20Go.jpg" width="300">
  <img src="https://github.com/wward49/home-maintenance-app/blob/master/ImagesHM/Screenshot_20250926_144747_Expo%20Go.jpg" width="300">
</p>
