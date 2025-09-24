import React, { useState, useRef, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, TouchableOpacity, ScrollView, Button, Alert, Modal, Pressable, TextInput} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DaySelector from './myComponents/DaySelector';
import MonthlySelector from './myComponents/MonthlySelector';
import styles from './styles';
import RepeatSelector from './myComponents/RepeatSelector.js';
import TaskNamer from './myComponents/TaskNamer.js';
import ToggleNotification from './myComponents/ToggleNotification.js';
import ConfirmTaskButton from './myComponents/ConfirmTaskButton.js';
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
  const [dayOfMonthChoice, setDayOfMonth] = useState('');
  const [monthlyRepeat, setMonthlyRepeat] = useState('');

  const [taskName, setTaskName] = useState('');
  const [notificationsOn, setNotificationFlag] = useState(false);


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
  
  //USER INPUT HANDLE FUNCTIONS-----------------------------------
  const scrollRef = useRef(null);

  const show = () => setVisible(true);
  const hide = () => {
    setVisible(false);
    resetOptionData();
  }

  const handleRemoveItemPress = (indexToRemove) => {
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
  const  handleTaskNameInput = (newTaskName) => {
    setTaskName(newTaskName);
  };

  const handleNotificationToggle = (flag) => {
    console.log('Toggled Notifications');
    setNotificationFlag(!flag);
  };

  //------------------BOX FOUR FUNCTIONS--------------------
  const handlePressConfirm = () => {
    const newTask = {
      taskName,
      userRepeatChoice,
      dayOfWeekChoice,
      dayOfMonthChoice,
      monthlyRepeat,
      notificationsOn,
    };

    insertItems((previousList) => [...previousList, newTask]);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
    hide();

  };

  const resetOptionData = () => {
    setUserRepeatChoice('weekly');
    setDayOfMonth('');
    setDayOfWeekChoice('Sun');
    setMonthlyRepeat('');
    setTaskName('');
    setNotificationFlag(false);
  }

  return (//-----------------------------------------START OF UI HERE-----------------------------------------------
    <SafeAreaView style={styles.appContainer}>
      {/*Container for the Calendar*/}
      <View style={styles.calendarContainer}>
        <Calendar
          style={styles.calendarStyle}
          firstDay={1}
          theme={{
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 12,
          }}
        /> 
      </View>

      {/*Container for the scrollable list of tasks that have been added*/}
      <View style={styles.listOfTasks}>
        <ScrollView ref={scrollRef}>
          {items.map((task, i) => {
            return (
              <TouchableOpacity
                key={i}
                style={styles.taskItem}
                onPress={() => console.log('Testing Press for Calander Interactions...')}
                onLongPress={() => handleRemoveItemPress(i)}
              >
                <Text style={styles.taskItemText}>{task.taskName || '(Untitled)'} - {task.userRepeatChoice}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
            {/**Add the item to the list, Set the variables back to default after finished, and then close the window */}
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

