import React, { useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, Modal} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DaySelector from './myComponents/DaySelector';
import MonthlySelector from './myComponents/MonthlySelector';
import styles from './styles';
import RepeatSelector from './myComponents/RepeatSelector.js';
import TaskNamer from './myComponents/TaskNamer.js';
import ToggleNotification from './myComponents/ToggleNotification.js';
import ConfirmTaskButton from './myComponents/ConfirmTaskButton.js';
import TaskList from './myComponents/TaskList.js';

//imported helper functions for calendar:
import { buildMonthIndex, computeMarkedDates } from './utils/recurrence';

//Key used for data persistence
const STORAGE_KEY = 'tasks_v1';

export default function App() {

  //HOOKS AND VARIABLES-----------------------------------------
  //Many of these variables are the building blocks of 'Task' Objects that make up the TaskList component.
  //The newTask objects are created in the handlePressConfirm() function in the 'Box Four Functions' Section.  
  const [items, insertItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [userRepeatChoice, setUserRepeatChoice] = useState('weekly');

  const [dayOfWeekChoice, setDayOfWeekChoice] = useState('Sun');
  const [dayOfMonthChoice, setDayOfMonth] = useState('1');
  const [monthlyRepeat, setMonthlyRepeat] = useState('1');

  const [taskName, setTaskName] = useState('');
  const [notificationsOn, setNotificationFlag] = useState(false);

  //**CALENDAR HOOKS -------------------------------------------*/
    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    );
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [markedDates, setMarkedDates] = useState({});
    const [highlightedTaskIds, setHighlightedTaskIds] = useState([]);
    const [biweeklyOffset, setBiweeklyOffset] = useState(0);


//LOAD AND SAVE DATA----------------------------------------------------------
  useEffect(() => {
    (async () => {
      try{
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if(saved){
          const parsed = JSON.parse(saved);
          if(Array.isArray(parsed)){
            insertItems(parsed);
          }
        }
      }
      catch (e){
        console.warn('Failed to load task list:', e);
      }
    }) ();


  }, []);

  useEffect(() => {
    (async () => {
      try{
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      }
      catch(e){
        console.warn('Failed to save task', e);
      }
    }) ();
  }, [items]);

  //CALENDAR HELP--------------------------------------

    useEffect(() => {
      const [yStr, mStr] = currentMonth.split('-');
      const y = Number(yStr), m = Number(mStr);
      const idx = buildMonthIndex(items, y, m);
      setMarkedDates(computeMarkedDates(idx, selectedTaskId, selectedDate));
      if(selectedTaskId){
        setHighlightedTaskIds([selectedTaskId]);
      }
      else if(selectedDate){
        setHighlightedTaskIds(Array.from(idx.get(selectedDate) || []));
      }
      else{
        setHighlightedTaskIds([]);
      }
    }, [items, currentMonth, selectedTaskId, selectedDate]);
  
  //USER INPUT HANDLE FUNCTIONS-----------------------------------
  //Most of these are passed as props to components in order connect user input to the variables at the top of this page.
  const show = () => setVisible(true);
  const hide = () => {
    setVisible(false);
    resetOptionData();
  }

  const handleRemoveTaskPress = (indexToRemove) => {
    Alert.alert('Remove Task?',
      'Task will be deleted forever',
      [{text: 'Cancel', style: 'cancel'}, 
        {text: 'Delete', style: 'destructive', 
          onPress: () => { 
            insertItems(previousList => previousList.filter((_, i) => i !== indexToRemove));
          },
        },
      ]
    );
  };

  const handleOnTaskPress = (i, task) =>{
    setSelectedTaskId(task.id);
    setSelectedDate(null);
  };

  const handleCalendarDayPress = ({ dateString }) => {
  setSelectedTaskId(null);
  setSelectedDate(dateString);
};
  
//-------------BOX ONE FUNCTIONS------------------------
  const handleRepeatOptionPress = (clickedOption) => {
    setUserRepeatChoice(clickedOption);
    console.log("User Picked:", clickedOption);
  };
  //-------------BOX TWO FUNCTIONS-----------------------
  //called from DaySelector. Sets dayOfWeekChoice to the users button input.
  const handleDayPress = (day) =>{
      setDayOfWeekChoice(day);
      console.log(day);
  };
  //called from MonthlySelector
  const handleRepeatGap = (gapText) => {
      const num = gapText.replace(/[^0-9]/g, "");
      if (num != "") {
        const clamped = Math.min(12, Math.max(1, Number(num)));
        setMonthlyRepeat(String(clamped));
      } else {
        setMonthlyRepeat("");
      }
  };
  //Called from MonthlySelector
  const handleDayInput = (dayText) => {
      const num = dayText.replace(/[^0-9]/g, "");
      if (num != "") {
        const clamped = Math.min(31, Math.max(1, Number(num)));
        setDayOfMonth(String(clamped));
      } else {
        setDayOfMonth("");
      }
  };
  //-----------------BOX THRESS FUNCTIONS------------------
  const handleTaskNameInput = (newTaskName) => {
    setTaskName(newTaskName);
  };

  const handleNotificationToggle = () => {
    console.log('Toggled Notifications');
    setNotificationFlag(prev => !prev);
  };

  //------------------BOX FOUR FUNCTIONS--------------------
  const handlePressConfirm = () => {
    //New task object is created here, sent to the TaskList. Any future information about a task should likely be added here.
    const newTask = {
      id: Date.now(),
      createdAt: Date.now(),
      taskName,
      userRepeatChoice,
      dayOfWeekChoice,
      dayOfMonthChoice,
      monthlyRepeat,
      notificationsOn,
      biweeklyOffset,
    };
    insertItems((previousList) => [...previousList, newTask]);
    hide();
  };

  //This is hooked up to whenever the window clsoes to reset the values of any user input that was given. That way opening with the 'Add Task' button will always give a fresh page. 
  const resetOptionData = () => {
    setUserRepeatChoice('weekly');
    setDayOfMonth('1');
    setDayOfWeekChoice('Sun');
    setMonthlyRepeat('1');
    setTaskName('');
    setNotificationFlag(false);
    setBiweeklyOffset(0);
  };

  return (//-----------------------------------------START OF UI HERE-----------------------------------------------
    <SafeAreaView style={styles.appContainer}>
      {/*Container for the Calendar*/}
      <View style={styles.calendarContainer}>
        <Calendar
          style={styles.calendarStyle}
          firstDay={1}
          markingType='custom'
          markedDates={markedDates}
          onDayPress={handleCalendarDayPress}
          onMonthChange={(m) => {
            setCurrentMonth(`${m.year}-${String(m.month).padStart(2, '0')}`);
          }}
          theme={{
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 12,
            dayTextColor: '#000',
            todayTextColor: '#000',
          }}
        /> 
      </View>

      {/*Container for the scrollable list of tasks that have been added*/}
      <View style={styles.listOfTasks}>
        <TaskList items={items} highlightedTaskIds={highlightedTaskIds} onTaskPress={handleOnTaskPress} onTaskLongPress={handleRemoveTaskPress}  />
      </View>

      {/*Container for the Button for adding tasks*/}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonInteractable} onPress={show}>
          <Text>Add Task</Text>
        </TouchableOpacity>
      </View>

      {/*Container for the Panel for setting up a new task*/}
      <Modal visible={visible} transparent animationType="slide">
        {/*Panel Itself */}
        <View style={styles.panel}> 
          {/*BOX ONE: Repeat Selector...pick weekly, biweekly, or monthly repeat for your task. */}
          <View style={styles.testBox}>
            <RepeatSelector selected={userRepeatChoice} onChangeRepeatChoice={handleRepeatOptionPress}/>
          </View>

          {/*BOX TWO: Day Selector */}
          <View style={styles.testBox}>
            {/**If Weekly or Bi Weekly, Then show the Day of the Week Picker. If Monthly, Allow user to enter the day of the month, and number of months to wait (1-12)...include or exlude this month option */}
            {userRepeatChoice === "monthly" ? <MonthlySelector monthlyRepeat={monthlyRepeat} onChangeGap={handleRepeatGap} dayOfMonth={dayOfMonthChoice} onChangeDayOfMonth={handleDayInput}/> : <DaySelector value={dayOfWeekChoice} onChange={handleDayPress} />}
          </View>

          {/*BOX THREE: Task Name and and Toggle for Biweekly offset. The Biweekly offset is for letting the user pick if they want the current week to be counted or not.*/}
          <View style={styles.testBox}>
            {/**This section could probably be implimented in a better way. It would make more sense to let the user give a start date and go from there. Currently it is confusing.*/}
            {userRepeatChoice === 'biweekly' && (
              <TouchableOpacity onPress={() => setBiweeklyOffset((prev) => (prev === 1 ? 0 : 1))} style={[styles.repeatStyle, biweeklyOffset === 1 && styles.toggleOnStyle]}>
                <Text style={styles.offsetTextStyle}>
                  {biweeklyOffset === 1 ? 'Skipping Next Available Day' : 'Starting At Next Given Day'}
                </Text>
              </TouchableOpacity>
            )
            }      

            {/**User input for naming the Task. */}
            <TaskNamer taskName={taskName} handleTaskNameInput={handleTaskNameInput}/>
          </View>

          {/*BOX FOUR: Finalize Task Confirmation Button */}
          <View style={[styles.testBox, { height: "20%" }]}>   
            {/**Add the item to the list, Set the variables back to default after finished, and then close the window.*/}
            {/**Toggle Notification Button is added, but functionality not yet implemented */}
            <ToggleNotification notificationsOn={notificationsOn} handleNotificationToggle={handleNotificationToggle}/> 
            <ConfirmTaskButton onPressConfirm={handlePressConfirm}/>
          </View>

        </View>

        {/*CLOSE BUTTON FOR PANEL*/}
        <View style={styles.panelCloseButtonContainer}>
          <TouchableOpacity style={styles.closePanelButton} onPress={hide}>
            <Text style={{ fontSize: 28 }}>X</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

