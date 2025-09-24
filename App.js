import React, { useState, useRef, useEffect} from 'react';
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

//Views are like Divs
//Text displays text on screen
//Function compoments
//onPress={() => console.log("Text Clicked!")} ... ....In line function
//const handlePress = () => console.log("Text Pressed!"); ... ...function... ...hook it up to an action like onPress
//functions need { }...after the arrow when they are doing more than 1 thing
//array deconstructing: const [current_vale, updater_function] = useState(firstInitialValue);


const STORAGE_KEY = 'tasks_v1';




export default function App() {

  //HOOKS AND VARIABLES-----------------------------------------
  const [items, insertItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [userRepeatChoice, setUserRepeatChoice] = useState('weekly');

  const [dayOfWeekChoice, setDayOfWeekChoice] = useState('Sun');
  const [dayOfMonthChoice, setDayOfMonth] = useState('1');
  const [monthlyRepeat, setMonthlyRepeat] = useState('1');

  const [taskName, setTaskName] = useState('');
  const [notificationsOn, setNotificationFlag] = useState(false);

  //**CALENDAR HOOKS */
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

  //CALENDAR HELP----**MUCH OF THE CALENDAR INTERACTION IS NOT MY OWN WORK**----------------------------------

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

  const resetOptionData = () => {
    setUserRepeatChoice('weekly');
    setDayOfMonth('1');
    setDayOfWeekChoice('Sun');
    setMonthlyRepeat('1');
    setTaskName('');
    setNotificationFlag(false);
    setBiweeklyOffset(0);
  }

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
          <Text>Add Item</Text>
        </TouchableOpacity>
      </View>

      {/*Container for the Panel for setting up a new task*/}
      <Modal visible={visible} transparent animationType="slide">
        {/*Panel Itself */}
        <View style={styles.panel}> 
          {/*BOX ONE: Repeat Selector */}
          <View style={styles.testBox}>
            <RepeatSelector selected={userRepeatChoice} onChangeRepeatChoice={handleRepeatOptionPress}/>
          </View>

          {/*BOX TWO: Day Selector */}
          <View style={styles.testBox}>
            {/**If Weekly or Bi Weekly, Then show the Day of the Week Picker. If Monthly, Allow user to enter the day of the month, and number of months to wait (1-12)...include or exlude this month option */}
            {userRepeatChoice === "monthly" ? <MonthlySelector monthlyRepeat={monthlyRepeat} onChangeGap={handleRepeatGap} dayOfMonth={dayOfMonthChoice} onChangeDayOfMonth={handleDayInput}/> : <DaySelector value={dayOfWeekChoice} onChange={handleDayPress} />}
          </View>

          {/*BOX THREE: Task Name and Notification Selector */}
          <View style={styles.testBox}>
            {/**User types a name and then picks whether to have notifications sent to phone or not. */}
            <TaskNamer taskName={taskName} handleTaskNameInput={handleTaskNameInput}/>
            <ToggleNotification notificationsOn={notificationsOn} handleNotificationToggle={handleNotificationToggle}/>
          </View>

          {/*BOX FOUR: Finalize Task Confirmation Button */}
          <View style={[styles.testBox, { height: "20%" }]}>
            {userRepeatChoice === 'biweekly' && (
              <TouchableOpacity onPress={() => setBiweeklyOffset((prev) => (prev === 1 ? 0 : 1))} style={[styles.buttonInteractable, biweeklyOffset === 1 && styles.buttonActive]}>
                <Text>
                  {biweeklyOffset === 1 ? 'Skipping Next Available Day' : 'Starting At Next Given Day'}
                </Text>
              </TouchableOpacity>
            )

            }
          
        
            {/**Add the item to the list, Set the variables back to default after finished, and then close the window.*/}
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

