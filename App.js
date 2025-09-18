import React, { useState, useRef} from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Platform, TouchableOpacity, ScrollView, Button, Alert, Modal, Pressable, TextInput} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DaySelector from './DaySelector';
import styles from './styles';
//Views are like Divs
//Text displays text on screen
//Function compoments
//onPress={() => console.log("Text Clicked!")} ... ....In line function
//const handlePress = () => console.log("Text Pressed!"); ... ...function... ...hook it up to an action like onPress
//functions need { }...after the arrow when they are doing more than 1 thing
//array deconstructing: const [current_vale, updater_function] = useState(firstInitialValue);


export default function App() {
  const [items, insertItems] = useState([]);
  const [visible, setVisible] =useState(false);
  const[userChoice, setUserChoice] = useState('weekly');

  const[taskName, setTaskName] = useState('')
  const[notificationsOn, setNotificationFlag] = useState(false);


  const scrollRef = useRef(null);

  const repeatOptions = ['weekly', 'biweekly', 'monthly'];

  const show = () => setVisible(true);
  const hide = () => setVisible(false);
  

  const handleRepeatOptionPress = (clickedOption) => {
    setUserChoice(clickedOption);
    console.log("User Picked:", clickedOption);
  }

  const handleInsertItemPress = () => {

    insertItems(previousList => [...previousList, `New Item ${previousList.length + 1}`])

    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true});
    }
    );
  };

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

  const  handleTaskNameInput = (newTaskName) => {
    setTaskName(newTaskName);
  }

  const handleNotificationToggle = (flag) => {
    console.log('Toggled Notifications');
    setNotificationFlag(!flag);
  }

  return (
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
          {items.map((txt, i) => {
            return(
            <TouchableOpacity key={i} style={styles.taskItem} onPress={() => handleRemoveItemPress(i)}>
              <Text style={styles.taskItemText}>{txt}</Text>
            </TouchableOpacity>
            )
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
      <Modal visible={visible} transparent animationType='slide'>

          {/*Panel Itself */}
          <View style={styles.panel}>

            {/*Repeat Selector */}
            <View style={styles.testBox}>
              {repeatOptions.map(option => 
                (
                <Pressable key={option} onPress={() => handleRepeatOptionPress(option)} style={[styles.repeatStyle, userChoice === option && styles.notificationToggleButtonOn]}>
                  <Text style={styles.repeatTextStyle}>{option}</Text>
                </Pressable>
                ))}
              
            </View>

            {/*Day Selector */}
            <View style={styles.testBox }> 
                {/**If Weekly or Bi Weekly, Then show the Day of the Week Picker. If Monthly, Allow user to enter the day of the month, and number of months to wait (1-12) */}
                <DaySelector></DaySelector>

            </View>

            {/*Task Name and Notification Selector */}
            <View style={styles.testBox}>
                {/**User types a name and then picks whether to have notifications sent to phone or not. */}
                <Text>Name of Task:</Text>
                <TextInput placeholder="Task Name Here" value={taskName} onChangeText={handleTaskNameInput} style={styles.inputBox}/>
                <Text>{taskName}</Text>

                <Pressable style={[styles.notificationToggleButtonOff, notificationsOn ? styles.notificationToggleButtonOn : styles.notificationToggleButtonOff ]} onPressIn={ () => handleNotificationToggle(notificationsOn)}>
                  <Text>Toggle Notification</Text>
                </Pressable>

            </View>
          
            {/*Finalize Task Confirmation Button */}
            <View style={[styles.testBox, {height: '20%'}]}>
                {/**Add the item to the list, Set the variables back to default after finished, and then close the window */}
                <Pressable style={[styles.repeatStyle, {height: '35%', width: '50%', alignSelf: 'center', marginBottom: 'auto' }]}>
                  <Text style={styles.repeatTextStyle}>
                    Confirm Task!
                  </Text>
                </Pressable>
                
            </View>

          </View>

          {/*CLOSE BUTTON FOR PANEL*/}
          <View style={styles.panelCloseButtonContainer}>
            <TouchableOpacity style={styles.closePanelButton} onPress={hide}>
              <Text style={{fontSize: 28,}}>X</Text>
            </TouchableOpacity>
          </View>
      </Modal>

    </SafeAreaView>

  );
}

